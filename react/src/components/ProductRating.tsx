import React from 'react';
import { Star } from 'tabler-icons-react';

const ProductRating: React.FC<{ rating: Number; count: Number }> = ({
  rating,
  count
}) => {
  if (!count || count <= 0) {
    return (
      <div className="mb-4 inline-flex text-sm text-gray-800">
        No ratings yet
      </div>
    );
  }
  return (
    <div className="mb-4 inline-flex items-center gap-2">
      <span
        className={`inline-flex items-center gap-1 rounded-md py-1 px-2 text-base ${
          rating > 3 ? 'bg-green-200 text-green-900' : 'bg-red-200 text-red-900'
        }`}
      >
        {rating}
        <Star strokeWidth={1.5} size={18} />
      </span>
      <span className="">({count})</span>
    </div>
  );
};

export default ProductRating;
