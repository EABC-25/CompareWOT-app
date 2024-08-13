import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { nanoid } from 'nanoid';

import {
  changeDisplayValues,
  getDisplayValuesStatus,
  getModalStatus,
  openSelect,
  openUpdate,
  tankDelete,
  getFixedSectionButtonStatus,
} from '../redux/tanksSlice';

import { GiTrashCan } from 'react-icons/gi';
import compareStats from '../data/initialCompareState';

const SectionColumn = ({ columnState = 'inactive', obj }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const { baseValuesOn } = useSelector(getDisplayValuesStatus);
  const isModalOpen = useSelector(getModalStatus);
  const fixed = useSelector(getFixedSectionButtonStatus);

  if (columnState === 'default') {
    return (
      <div className='obj-column'>
        <div className='obj-cell blank full' />
        {/* // should be disabled when overlay is open */}
        <div className={`obj-cell dropdown-container ${fixed ? 'fixed' : ''}`}>
          <button
            className='obj-cell column-btn active-btn'
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <p>
              {baseValuesOn ? 'Base Values' : 'Effective Values'}{' '}
              {dropdownOpen ? '▲' : '▼'}
            </p>
          </button>
          {dropdownOpen ? (
            <div className='dropdown-values'>
              <div
                onClick={() => {
                  dispatch(changeDisplayValues(true));
                  setDropdownOpen(false);
                }}
              >
                <p>Base Values</p>
              </div>
              <div
                onClick={() => {
                  dispatch(changeDisplayValues(false));
                  setDropdownOpen(false);
                }}
              >
                <p>Effective Values</p>
              </div>
            </div>
          ) : null}
        </div>
        <div className='obj-cell blank semi'>
          <p>general</p>
        </div>
        {compareStats.general.map(value => {
          return (
            <div key={value} className='obj-cell default'>
              <p>{value}</p>
            </div>
          );
        })}
        <div className='obj-cell blank'>
          <p>firepower</p>
        </div>
        {compareStats.firepower.map((value, idx) => {
          return (
            <div
              key={value}
              className={`obj-cell default ${
                idx === compareStats.firepower.length - 1 && 'overflow-mobile'
              }`}
            >
              <p>{value}</p>
            </div>
          );
        })}
        <div className='obj-cell blank'>
          <p>gun handling</p>
        </div>
        {compareStats.gunHandling.map(value => {
          return (
            <div key={value} className='obj-cell default'>
              <p>{value}</p>
            </div>
          );
        })}
        <div className='obj-cell blank'>
          <p>mobility</p>
        </div>
        {compareStats.mobility.map((value, idx) => {
          return (
            <div
              key={value}
              className={`obj-cell default ${
                idx === compareStats.mobility.length - 1 && 'overflow-mobile'
              }`}
            >
              <p>{value}</p>
            </div>
          );
        })}
        <div className='obj-cell blank'>
          <p>armor & health</p>
        </div>
        {compareStats.armorAndHealth.map(value => {
          return (
            <div key={value} className='obj-cell default'>
              <p>{value}</p>
            </div>
          );
        })}
        <div className='obj-cell blank'>
          <p>miscellaneous</p>
        </div>
        {compareStats.miscellaneous.map(value => {
          return (
            <div key={value} className='obj-cell default'>
              <p>{value}</p>
            </div>
          );
        })}
        <div className='obj-cell blank' />
      </div>
    );
  }

  if (columnState === 'main') {
    const generalVals = Object.values(obj.general);
    const firepowerVals = Object.values(obj.firepower);
    const gunHandlingVals = Object.values(obj.gunHandling);
    const mobilityVals = Object.values(obj.mobility);
    const armorAndHealthVals = Object.values(obj.armorAndHealth);
    const miscVals = Object.values(obj.miscellaneous);

    return (
      <div className='obj-column'>
        <div className='img-container'>
          <img
            src={obj.largeImg}
            alt='tank'
            className='obj-cell column-img'
            draggable='false'
          ></img>
          <p>{obj.tank_name}</p>
        </div>
        <button
          type='button'
          className={`obj-cell column-btn active-btn ${fixed ? 'fixed' : ''}`}
          disabled={isModalOpen}
          onClick={() => {
            dispatch(
              openUpdate({
                flag: 'openUpdateMain',
                tank: {
                  tank_id: obj.tank_id,
                  tier: obj.general.tier,
                  type: obj.general.type,
                },
              })
            );
          }}
        >
          <p>update tank</p>
        </button>
        <div className='obj-cell blank'>
          <p>general</p>
        </div>
        {generalVals.map(value => {
          return (
            <div key={nanoid()} className='obj-cell'>
              <p>{value}</p>
            </div>
          );
        })}
        <div className='obj-cell blank'>
          <p>firepower</p>
        </div>
        {firepowerVals.map(value => {
          return (
            <div key={nanoid()} className='obj-cell'>
              <p>{value}</p>
            </div>
          );
        })}
        <div className='obj-cell blank'>
          <p>gun handling</p>
        </div>
        {gunHandlingVals.map(value => {
          return (
            <div key={nanoid()} className='obj-cell'>
              <p>{value}</p>
            </div>
          );
        })}
        <div className='obj-cell blank'>
          <p>mobility</p>
        </div>
        {mobilityVals.map(value => {
          return (
            <div key={nanoid()} className='obj-cell'>
              <p>{value}</p>
            </div>
          );
        })}
        <div className='obj-cell blank'>
          <p>armor & health</p>
        </div>
        <div className='obj-cell hull-default'>
          <p>{armorAndHealthVals[0][0]}</p>
          <p>{armorAndHealthVals[0][1]}</p>
          <p>{armorAndHealthVals[0][2]}</p>
        </div>
        <div className='obj-cell turret-default'>
          <p>{armorAndHealthVals[1][0]}</p>
          <p>{armorAndHealthVals[1][1]}</p>
          <p>{armorAndHealthVals[1][2]}</p>
        </div>
        <div className='obj-cell'>
          <p>{armorAndHealthVals[2]}</p>
        </div>
        <div className='obj-cell blank'>
          <p>miscellaneous</p>
        </div>
        {miscVals.map((value, idx) => {
          return (
            <div key={nanoid()} className='obj-cell'>
              <p>
                {value}
                {idx === miscVals.length - 2 && '%'}
              </p>
            </div>
          );
        })}
        <div className='obj-cell blank' />
      </div>
    );
  }

  if (columnState === 'active') {
    const generalVals = Object.values(obj.general);
    const firepowerVals = Object.values(obj.firepower);
    const gunHandlingVals = Object.values(obj.gunHandling);
    const mobilityVals = Object.values(obj.mobility);
    const armorAndHealthVals = Object.values(obj.armorAndHealth);
    const miscVals = Object.values(obj.miscellaneous);

    const compareResults = obj.compareResults;

    const cellColor = {
      best: 'rgb(157,227,134)',
      great: 'rgb(187,234,171)',
      good: 'rgb(202,238,190)',
      poor: 'rgb(241,203,203)',
      bad: 'rgb(237,169,169)',
      worst: 'rgb(238,161,161)',
      null: 'rgb(94,106,114)',
    };

    return (
      <div className='obj-column'>
        <div className='img-container'>
          <img
            src={obj.largeImg}
            alt='tank'
            className='obj-cell column-img'
            draggable='false'
          ></img>
          <p>{obj.tank_name}</p>
          <div
            className='tank-delete'
            onClick={() => {
              dispatch(tankDelete(obj.columnNumber));
            }}
          >
            <GiTrashCan />
          </div>
        </div>
        <button
          type='button'
          className={`obj-cell column-btn active-btn ${fixed ? 'fixed' : ''}`}
          // should be disabled when overlay modal is open
          onClick={() => {
            dispatch(
              openUpdate({
                flag: 'openUpdateSub',
                tank: {
                  tank_id: obj.tank_id,
                  tier: obj.general.tier,
                  type: obj.general.type,
                },
                columnNumber: obj.columnNumber,
              })
            );
          }}
        >
          <p>update tank</p>
        </button>
        <div className='obj-cell blank'>
          <p>general</p>
        </div>
        {generalVals.map(value => {
          return (
            <div key={nanoid()} className='obj-cell'>
              <p>{value}</p>
            </div>
          );
        })}
        <div className='obj-cell blank'>
          <p>firepower</p>
        </div>
        {firepowerVals.map((value, idx) => {
          return (
            <div
              key={nanoid()}
              className='obj-cell'
              style={{
                backgroundColor: `${cellColor[compareResults.firepower[idx]]}`,
                color: `${compareResults.firepower[idx] && 'black'}`,
              }}
            >
              <p
                style={{
                  color: `${compareResults.firepower[idx] && '#000'}`,
                }}
              >
                {value}
              </p>
            </div>
          );
        })}
        <div className='obj-cell blank'>
          <p>gun handling</p>
        </div>
        {gunHandlingVals.map((value, idx) => {
          return (
            <div
              key={nanoid()}
              className='obj-cell'
              style={{
                backgroundColor: `${
                  cellColor[compareResults.gunHandling[idx]]
                }`,
              }}
            >
              <p
                style={{
                  color: `${compareResults.gunHandling[idx] && '#000'}`,
                }}
              >
                {value}
              </p>
            </div>
          );
        })}
        <div className='obj-cell blank'>
          <p>mobility</p>
        </div>
        {mobilityVals.map((value, idx) => {
          return (
            <div
              key={nanoid()}
              className='obj-cell'
              style={{
                backgroundColor: `${cellColor[compareResults.mobility[idx]]}`,
              }}
            >
              <p
                style={{
                  color: `${compareResults.mobility[idx] && '#000'}`,
                }}
              >
                {value}
              </p>
            </div>
          );
        })}
        <div className='obj-cell blank'>
          <p>armor & health</p>
        </div>
        <div className='obj-cell hull'>
          <p
            style={{
              backgroundColor: `${
                cellColor[compareResults.armorAndHealth[0][0]]
              }`,
              color: `${compareResults.armorAndHealth[0][0] && '#000'}`,
            }}
          >
            {armorAndHealthVals[0][0]}
          </p>
          <p
            style={{
              backgroundImage: `linear-gradient(to right bottom, ${
                cellColor[compareResults.armorAndHealth[0][0]]
              } 40%, ${cellColor[compareResults.armorAndHealth[0][1]]} 60%)`,
            }}
          />
          <p
            style={{
              backgroundColor: `${
                cellColor[compareResults.armorAndHealth[0][1]]
              }`,
              color: `${compareResults.armorAndHealth[0][1] && '#000'}`,
            }}
          >
            {armorAndHealthVals[0][1]}
          </p>
          <p
            style={{
              backgroundImage: `linear-gradient(to right bottom, ${
                cellColor[compareResults.armorAndHealth[0][1]]
              } 40%, ${cellColor[compareResults.armorAndHealth[0][2]]} 60%)`,
            }}
          />
          <p
            style={{
              backgroundColor: `${
                cellColor[compareResults.armorAndHealth[0][2]]
              }`,
              color: `${compareResults.armorAndHealth[0][2] && '#000'}`,
            }}
          >
            {armorAndHealthVals[0][2]}
          </p>
        </div>
        <div className='obj-cell turret'>
          <p
            style={{
              backgroundColor: `${
                cellColor[compareResults.armorAndHealth[1][0]]
              }`,
              color: `${compareResults.armorAndHealth[1][0] && '#000'}`,
            }}
          >
            {armorAndHealthVals[1][0]}
          </p>
          <p
            style={{
              backgroundImage: `linear-gradient(to right bottom, ${
                cellColor[compareResults.armorAndHealth[1][0]]
              } 40%, ${cellColor[compareResults.armorAndHealth[1][1]]} 60%)`,
            }}
          />
          <p
            style={{
              backgroundColor: `${
                cellColor[compareResults.armorAndHealth[1][1]]
              }`,
              color: `${compareResults.armorAndHealth[1][1] && '#000'}`,
            }}
          >
            {armorAndHealthVals[1][1]}
          </p>
          <p
            style={{
              backgroundImage: `linear-gradient(to right bottom, ${
                cellColor[compareResults.armorAndHealth[1][1]]
              } 40%, ${cellColor[compareResults.armorAndHealth[1][2]]} 60%)`,
            }}
          />
          <p
            style={{
              backgroundColor: `${
                cellColor[compareResults.armorAndHealth[1][2]]
              }`,
              color: `${compareResults.armorAndHealth[1][2] && '#000'}`,
            }}
          >
            {armorAndHealthVals[1][2]}
          </p>
        </div>
        <div
          className='obj-cell'
          style={{
            backgroundColor: `${cellColor[compareResults.armorAndHealth[2]]}`,
          }}
        >
          <p
            style={{
              color: `${compareResults.armorAndHealth[2] && '#000'}`,
            }}
          >
            {armorAndHealthVals[2]}
          </p>
        </div>
        <div className='obj-cell blank'>
          <p>miscellaneous</p>
        </div>
        {miscVals.map((value, idx) => {
          return (
            <div
              key={nanoid()}
              className='obj-cell'
              style={{
                backgroundColor: `${
                  cellColor[compareResults.miscellaneous[idx]]
                }`,
              }}
            >
              <p
                style={{
                  color: `${compareResults.miscellaneous[idx] && '#000'}`,
                }}
              >
                {value}
                {idx === miscVals.length - 2 && '%'}
              </p>
            </div>
          );
        })}
        <div className='obj-cell blank' />
      </div>
    );
  }

  if (columnState === 'inactive') {
    return (
      <div className='obj-column'>
        <div className='obj-cell column-img'></div>
        <button
          type='button'
          className={`obj-cell column-btn inactive-btn ${fixed ? 'fixed' : ''}`}
          disabled={isModalOpen}
          onClick={() => {
            dispatch(openSelect());
          }}
        >
          <p>select tank</p>
        </button>
      </div>
    );
  }
};

export default SectionColumn;
