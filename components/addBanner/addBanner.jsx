export default function AdBanner({ size = '728x90' }) {
    return (
      <div className={`bg-gray-200 text-center py-4 my-4 ${size === '728x90' ? 'w-[728px] h-[90px]' : 'w-[300px] h-[250px]'} mx-auto`}>
        <p className="text-gray-500">[Ad Placeholder - {size}]</p>
      </div>
    );
  }