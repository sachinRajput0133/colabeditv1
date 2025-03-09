import Link from "next/link";

const CustomLink = ({
  // eslint-disable-next-line no-script-url
  href = "javascript:;",
  children,
  className,
  onClick,
  dataTip,
  onKeyPress = () => false,
  download = false,
  ...other
}) => {
  return (
    <Link href={href} className={className}>
      {/* <a
        className={className}
        download={download}
        onClick={onClick}
        onKeyDown={(e) => onKeyPress(e)}
        data-tip={dataTip}
        {...other}
      > */}
        {children}
      {/* </a> */}
    </Link>
  );
};

export default CustomLink;
