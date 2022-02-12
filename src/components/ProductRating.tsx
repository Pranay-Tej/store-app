import React from 'react';
import StarOutlineIcon from '@mui/icons-material/StarOutline';

const ProductRating: React.FC<{ rating: Number; count: Number }> = ({
  rating,
  count
}) => {
  if (count <= 0) {
    return <div className="inline-flex">No ratings yet</div>;
  }
  return (
    <div className="mb-4 inline-flex items-center gap-2">
      <span
        className={`inline-flex items-center gap-1 rounded-md py-1 px-2 text-base ${
          rating > 3 ? 'bg-green-200 text-green-900' : 'bg-red-200 text-red-900'
        }`}
      >
        {rating}
        <StarOutlineIcon fontSize="small" />
      </span>
      <span className="">({count})</span>
    </div>
  );
};

export default ProductRating;
