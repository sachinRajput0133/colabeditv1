import Link from 'next/link';

export default function ReviewCard({ review }) {
  return (
    <div className="border rounded-lg p-4 shadow-md hover:shadow-lg transition">
      <img src={review.imageUrl} alt={review.title} className="w-full h-48 object-cover rounded-md mb-4" />
      <h3 className="text-xl font-semibold">{review.title}</h3>
      <p className="text-gray-600 line-clamp-2">{review.content}</p>
      <Link href={`/reviews/${review.id}`} className="text-blue-500 mt-2 inline-block">
        Read More
      </Link>
    </div>
  );
}