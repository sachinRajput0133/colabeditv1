import { Server } from "socket.io";
import Document from "@models/Document";
import Version from "@models/Version";
import dbConnect from "@lib/db";
import { CONFIG } from "../../../config/index";

export const config = {
  api: {
    bodyParser: false,
  },
};

const SocketHandler = async (req, res) => {
  if (res.socket.server.io) {
    console.log("Socket server already running");
    res.end();
    return;
  }

  await dbConnect();

  console.log("Setting up socket server...");

  const io = new Server(res.socket.server, {
    path: "/api/socket",
    cors: {
      origin: CONFIG.FETCH_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: false,
    },
  });

  res.socket.server.io = io;

  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on("join-document", async ({ documentId, userId, userName }) => {
      socket.join(documentId);
      // console.log(`User ${userId} (${userName}) joined document: ${documentId}`);
      console.log("11111111");
      try {
        const document = await Document.findById(documentId);
        console.log("joinnnnn");
        if (document) {
          socket.emit("load-document", document.content);

          socket.to(documentId).emit("user-joined", {
            userId,
            userName,
            socketId: socket.id,
          });
        }
      } catch (error) {
        ss;
        console.error("Error loading document:", error);
        socket.emit("error", { message: "Error loading document" });
      }
    });

    socket.on("send-changes", ({ documentId, delta, userId }) => {
      console.log("🚀 ~ socket.on ~ userId:", userId);
      console.log("🚀 ~ socket.on ~ delta:", delta);
      // Broadcast changes to all clients in the room except sender
      io.to(documentId).emit("receive-changes", {
        delta,
        userId,
      });
    });
    socket.on(
      "request-previous-next-version",
      async ({ documentId, isPrevious = false, userId }) => {
        console.log("🚀 ~ socket.on ~ isPrevious:", isPrevious);
        try {
          const currentVersion = await Version.findOne({
            documentId,
            isInUse: true,
          });
          console.log("🚀 ~ socket.on ~ currentVersion:", currentVersion);
          console.log("111111");
          if (!currentVersion) {
            socket.emit("version-error", {
              error: "No current version found with isInUse=true",
            });
            return;
          }
          console.log("22222");
          const versionQuery = isPrevious
            ? { $lt: currentVersion.versionNumber }
            : { $gt: currentVersion.versionNumber };
          console.log("🚀 ~ socket.on ~ versionQuery:", versionQuery);
          const previousVersion = await Version.findOne({
            documentId,
            versionNumber: versionQuery,
          }).sort({ versionNumber: isPrevious ? -1 : 1 }); // Sort in descending order to get the most recent one
          console.log("🚀 ~ socket.on ~ previousVersion:", previousVersion);

          if (!previousVersion) {
            socket.emit("version-error", {
              error: "No previous version found for this document",
            });
            return;
          }
          await Version.updateOne(
            {
              _id: currentVersion._id,
            },
            { isInUse: false }
          );
          const updated = await Version.updateOne(
            {
              _id: previousVersion._id,
            },
            { isInUse: true }
          );
          console.log("🚀 ~ socket.on ~ updated:", updated);
          console.log("33333", previousVersion?.content);
          console.log("44444");
          await Document.updateOne(
            { _id: documentId }, // Query filter to find the document by ID
            {
              content: previousVersion?.content,
              lastModifiedBy: previousVersion?.createdBy, // Update fields
            }
          );
          console.log("55555");
          console.log("🚀 ~ io.to ~ previousVersion:", previousVersion);
          io.to(documentId).emit("load-document", previousVersion?.content);
        } catch (error) {
          console.error("Error retrieving previous version:", error);
          socket.emit("version-error", {
            error: "Failed to retrieve previous version",
          });
        }
      }
    );

    socket.on(
      "cursor-position",
      ({ documentId, position, userId, userName }) => {
        socket.to(documentId).emit("cursor-update", {
          userId,
          userName,
          position,
        });
      }
    );

    socket.on("save-document", async ({ documentId, content, userId }) => {
      try {
        console.log("🚀 ~ socket.on ~ content:", content);
        await Document.updateOne(
          { _id: documentId }, // Query filter to find the document by ID
          {
            content, // Update fields
            lastModifiedBy: userId,
          }
        );

        const versionsCount = await Version.countDocuments({ documentId });

        await Version.create({
          documentId,
          content,
          createdBy: userId,
          versionNumber: versionsCount + 1,
        });

        io.to(documentId).emit("document-saved", {
          savedAt: new Date().toISOString(),
          content,
        });
      } catch (error) {
        console.error("Error saving document:", error);
        socket.emit("save-error", { error: "Failed to save document" });
      }
    });

    socket.on("leave-document", ({ documentId, userId, userName }) => {
      socket.leave(documentId);
      socket.to(documentId).emit("user-left", { userId, userName });
      console.log(`User ${userId} (${userName}) left document: ${documentId}`);
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  console.log("Socket server initialized");
  res.end();
};

export default SocketHandler;
