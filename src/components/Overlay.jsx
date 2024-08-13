import { useSelector, useDispatch } from 'react-redux';
import { nanoid } from 'nanoid';
import classnames from 'classnames';

import SelectedContainer from './SelectedContainer';
import {
  setSelected,
  setSelectedTier,
  setSelectedType,
  setSelectedNation,
  getSelectedValues,
  getUpdateFlagStatus,
  resetModuleId,
  getModalStatus,
} from '../redux/tanksSlice';
import { useGetTanksQuery } from '../api/apiSlice';
import { flags } from '../utils/utils';

import Loading from './Loading';

const tiers = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
const types = [
  'Light Tank',
  'Medium Tank',
  'Heavy Tank',
  'Tank Destroyer',
  'SPG',
];

const Overlay = () => {
  const dispatch = useDispatch();
  const isModalOpen = useSelector(getModalStatus);
  const { selected, selectedTier, selectedType, selectedNation } =
    useSelector(getSelectedValues);
  const { fetchTanksFlag } = useSelector(getUpdateFlagStatus);

  const {
    data: tanks,
    isLoading: tanksLoading,
    isFetching: tanksFetching,
    isSuccess: tanksSuccess,
    isError: tanksIsError,
    error: tanksError,
  } = useGetTanksQuery(
    {
      tier: selectedTier,
      type: selectedType,
      nation: selectedNation,
    },
    {
      skip: !fetchTanksFlag,
    }
  );

  let content = <div className='selection-container'></div>;

  if (tanksLoading || tanksFetching) {
    content = (
      <div className='selection-container'>
        <Loading size='2rem' />
      </div>
    );
  } else if (tanksSuccess) {
    let mapped;
    if (tanks.status !== 'error') {
      mapped = tanks.map(item => {
        return (
          <button
            key={nanoid()}
            className={
              selected === item.tank_id
                ? 'selection-item active'
                : 'selection-item'
            }
            type='button'
            onClick={() => {
              dispatch(resetModuleId());
              dispatch(setSelected(item.tank_id));
            }}
          >
            <img
              className='selection-img'
              src={item.images.big_icon}
              alt='tank'
              draggable='false'
            ></img>
            <p>{item.name}</p>
          </button>
        );
      });
    } else {
      mapped = <div>Failure to load tanks, please try again later</div>;
    }

    const containerClassName = classnames('selection-container', {
      disabled: tanksFetching,
    });
    content = <div className={containerClassName}>{mapped}</div>;
  } else if (tanksIsError) {
    content = (
      <div className='selection-container'>
        <div>{tanksError}</div>
      </div>
    );
  }

  return (
    <section
      className={`overlay ${isModalOpen ? 'active' : ''}`}
      style={{
        zIndex: `${isModalOpen ? '3' : '-1'}`,
        display: `${isModalOpen ? 'flex' : 'none'}`,
      }}
    >
      <div className='modal'>
        <div className='filter-container'>
          <div className='filter-cell'>
            <div type='button' className='filter-btn header'>
              <p>tier</p>
            </div>
            <div className='filter-selection tier'>
              {tiers.map((tier, idx) => {
                return (
                  <div
                    key={nanoid()}
                    className={`filter-btn ${
                      selectedTier === idx + 1 ? 'default' : ''
                    }`}
                    onClick={() => {
                      dispatch(setSelectedTier(idx + 1));
                    }}
                    disabled={tanksLoading || tanksFetching}
                  >
                    <p>{tier}</p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className='filter-cell'>
            <div type='button' className='filter-btn header'>
              <p>type</p>
            </div>
            <div className='filter-selection types'>
              {types.map(type => {
                return (
                  <div
                    key={nanoid()}
                    className={`filter-btn ${
                      selectedType === type ? 'default' : ''
                    }`}
                    onClick={() => {
                      dispatch(setSelectedType(type));
                    }}
                    disabled={tanksLoading || tanksFetching}
                  >
                    <p>{type}</p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className='filter-cell mobile-nations'>
            <div type='button' className='filter-btn header nations'>
              <p>nation</p>
            </div>
            <div className='filter-selection nations'>
              {flags.map((nation, idx) => {
                if (idx === 0) {
                  return (
                    <div
                      key={nanoid()}
                      className={`filter-btn country ${
                        selectedNation === nation.country ? 'default' : ''
                      }`}
                      onClick={() =>
                        dispatch(setSelectedNation(nation.country))
                      }
                      disabled={tanksLoading || tanksFetching}
                    >
                      <img draggable='false' />
                      <p>{nation.country}</p>
                    </div>
                  );
                }
                return (
                  <div
                    type='button'
                    key={nanoid()}
                    className={`filter-btn country ${
                      selectedNation === nation.country ? 'default' : ''
                    }`}
                    onClick={() => dispatch(setSelectedNation(nation.country))}
                    disabled={tanksLoading || tanksFetching}
                  >
                    <img
                      draggable='false'
                      src={nation.flag}
                      alt={nation.country}
                    />
                    <p>{nation.country}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <SelectedContainer />
        {content}
      </div>
    </section>
  );
};

export default Overlay;
