// import React, { useState, useEffect } from 'react';
// import Slider from 'rc-slider';
// import 'rc-slider/assets/index.css';

// const PriceRangeSlider = ({ onRangeChange, min, max }) => {
//   const [range, setRange] = useState([min, max]);

//   // Cập nhật range khi min hoặc max thay đổi
//   useEffect(() => {
//     setRange([min, max]);
//   }, [min, max]);

//   const handleRangeChange = (value) => {
//     setRange(value);
//     onRangeChange(value); // Truyền giá trị mới lên component cha
//   };

//   return (
//     <div style={{ padding: '20px' }}>
//       <h3>Filter by Price</h3>
//       <Slider
//         range
//         min={0}
//         max={10000}
//         value={range}
//         onChange={handleRangeChange}
//         marks={{
//           0: '$0',
//           2500: '$2,500',
//           5000: '$5,000',
//           7500: '$7,500',
//           10000: '$10,000',
//         }}
//       />
//       <div style={{ marginTop: '40px' }}>
//         {/* <span>Selected Range: ${range[0]} - ${range[1]}</span> */}
//       </div>
//     </div>
//   );
// };

// export default PriceRangeSlider;

import React, { useState, useEffect } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const PriceRangeSlider = ({ onRangeChange, min, max }) => {
  const [range, setRange] = useState([min, max]);

  // Cập nhật range khi min hoặc max thay đổi
  useEffect(() => {
    setRange([min, max]);
  }, [min, max]);

  const handleRangeChange = (value) => {
    setRange(value);
    onRangeChange(value); // Truyền giá trị mới lên component cha
  };

  return (
    <div style={{ padding: '20px' }}>
      <h3>Filter by Price</h3>
      <Slider
        range
        min={0}
        max={1000}
        value={range}
        onChange={handleRangeChange}
        marks={{
          0: '$0',
          200: '$200',
          400: '$400',
          600: '$600',
          800: '$800',
          1000: '$1,000',
        }}
      />
      <div style={{ marginTop: '40px' }}>
        {/* <span>Selected Range: ${range[0]} - ${range[1]}</span> */}
      </div>
    </div>
  );
};

export default PriceRangeSlider;