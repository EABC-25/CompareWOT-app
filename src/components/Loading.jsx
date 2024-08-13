import React from 'react';
import { GiTank } from 'react-icons/gi';

const Loading = ({ size }) => {
  return (
    <div className='loading-page'>
      <h1 style={{ fontSize: size }}>Loading...</h1>
    </div>
  );
};

export default Loading;
