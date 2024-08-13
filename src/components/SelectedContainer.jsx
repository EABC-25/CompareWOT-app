import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { useGetTankQuery } from '../api/apiSlice';
import {
  setStagingArea,
  setCopyForBaseValue,
  tankAdded,
  tankModify,
  restoreDefaults,
  resetModuleId,
  getSelectedValues,
  getUpdateFlagStatus,
  getStagedObject,
  setSelectedModuleBtn,
  getSelectedModulesValues,
} from '../redux/tanksSlice';

import { createTankObj, createModuleObj } from '../utils/utils';

import ModuleSelection from './ModuleSelection';
import ModuleInfo from './ModuleInfo';

import { GiGunshot } from 'react-icons/gi';
import { RiRadioFill } from 'react-icons/ri';
import { PiEngineFill } from 'react-icons/pi';
import { GiTankTread } from 'react-icons/gi';
import { GiTurret } from 'react-icons/gi';
import { GiSave } from 'react-icons/gi';
import { GiCancel } from 'react-icons/gi';

import { toast } from 'react-toastify';

const tier = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

const SelectedContainer = () => {
  const dispatch = useDispatch();
  const { selected } = useSelector(getSelectedValues);
  const staged = useSelector(getStagedObject);
  const { selectedModuleBtn } = useSelector(getSelectedModulesValues);
  const { fetchTankFlag, flagUpdateMain, flagUpdateSub, columnNumber } =
    useSelector(getUpdateFlagStatus);

  const initTank = useCallback(async data => {
    if (data !== undefined) {
      let newData = await createTankObj(data[0]);

      const {
        modules,
        profileModule,
        profileId,
        profileIdStr,
        defaultProfileId,
        defaultProfileIdStr,
      } = await createModuleObj(data[0]);

      newData = {
        ...newData,
        modules,
        profileModule,
        profileId,
        profileIdStr,
        defaultProfileId,
        defaultProfileIdStr,
      };

      dispatch(setStagingArea(newData));
      dispatch(setCopyForBaseValue(newData));
    }
  }, []);

  const {
    currentData,
    isLoading: tankLoading,
    isFetching: tankFetching,
    isSuccess: tankSuccess,
    isError: tankIsError,
    error: tankError,
  } = useGetTankQuery(selected, {
    skip: !fetchTankFlag,
  });

  useEffect(() => {
    if (currentData !== undefined && currentData?.status !== 'error') {
      initTank(currentData);
    } else if (currentData?.status === 'error') {
      toast.error('Tank unavailable');
    }
  }, [currentData]);

  let tankContent = (
    <div className='selected-tank-section'>
      <div className='tvstyle-img'></div>
      <div className='selection-header info'>
        <p>TANK INFO:</p>
      </div>
      <div className='selected-tank-info'>
        <h4>
          <span>NAME:</span>&nbsp;&nbsp; N/A
        </h4>
        <h4>
          <span>TIER:</span>&nbsp;&nbsp; N/A
        </h4>
        <h4>
          <span>NATION:</span>&nbsp;&nbsp; N/A
        </h4>
        <h4>
          <span>TYPE:</span>&nbsp;&nbsp; N/A
        </h4>
        <h4>
          <span>PREMIUM:</span>&nbsp;&nbsp; N/A
        </h4>
      </div>
    </div>
  );
  let moduleSelection = <ModuleSelection />;

  if (tankLoading || tankFetching) {
    tankContent = (
      <div className='selected-tank-section'>
        <div className='tvstyle-img'>
          <h4>LOADING..</h4>
        </div>
        <div className='selection-header info'>
          <p>TANK INFO:</p>
        </div>
        <div className='selected-tank-info'>
          <h4>
            <span>NAME:</span>&nbsp;&nbsp; LOADING..
          </h4>
          <h4>
            <span>TIER:</span>&nbsp;&nbsp; LOADING..
          </h4>
          <h4>
            <span>NATION:</span>&nbsp;&nbsp; LOADING..
          </h4>
          <h4>
            <span>TYPE:</span>&nbsp;&nbsp; LOADING..
          </h4>
          <h4>
            <span>PREMIUM:</span>&nbsp;&nbsp; LOADING..
          </h4>
        </div>
      </div>
    );
    moduleSelection = <ModuleSelection status='loading' />;
  } else if (staged) {
    tankContent = (
      <div className='selected-tank-section'>
        <div className='tvstyle-img'>
          <img draggable='false' src={staged.largeImg} alt={staged.tank_name} />
        </div>
        <div className='selection-header info'>
          <p>TANK INFO:</p>
        </div>
        <div className='selected-tank-info'>
          <h4>
            <span>NAME:</span>&nbsp;&nbsp;
            {staged.tank_name}
          </h4>
          <h4>
            <span>TIER:</span>&nbsp;&nbsp;
            {tier.indexOf(staged.general.tier) + 1}
          </h4>
          <h4>
            <span>NATION:</span>&nbsp;&nbsp;
            {staged.general.nation}
          </h4>
          <h4>
            <span>TYPE:</span>&nbsp;&nbsp;
            {staged.general.type}
          </h4>
          <h4>
            <span>PREMIUM:</span>&nbsp;&nbsp;
            {staged.premium ? 'Yes' : 'No'}
          </h4>
        </div>
      </div>
    );
    moduleSelection = <ModuleSelection status='success' />;
  } else if (tankIsError) {
    tankContent = (
      <div className='selected-tank-section'>
        <div className='tvstyle-img'></div>
        <div className='selection-header info'>
          <p>TANK INFO:</p>
        </div>
        <div className='selected-tank-info'>
          <h4>
            <span>NAME:</span>&nbsp;&nbsp; N/A..
          </h4>
          <h4>
            <span>TIER:</span>&nbsp;&nbsp; N/A..
          </h4>
          <h4>
            <span>NATION:</span>&nbsp;&nbsp; N/A..
          </h4>
          <h4>
            <span>TYPE:</span>&nbsp;&nbsp; N/A..
          </h4>
          <h4>
            <span>PREMIUM:</span>&nbsp;&nbsp; N/A..
          </h4>
        </div>
      </div>
    );
    moduleSelection = <ModuleSelection status='error' />;
  }

  return (
    <div className='selected-container'>
      <div className='selected-container-shadow'>
        {tankContent}
        <div className='selected-tank-modules'>
          <div className='module-list'>
            <button
              className={selectedModuleBtn === 'turrets' ? 'active' : ''}
              disabled={!selected}
              onClick={() => {
                dispatch(resetModuleId());
                dispatch(setSelectedModuleBtn('turrets'));
              }}
            >
              <GiTurret className='module-icon' />
              <p>Turret</p>
            </button>
            <button
              className={selectedModuleBtn === 'guns' ? 'active' : ''}
              disabled={!selected}
              onClick={() => {
                dispatch(resetModuleId());
                dispatch(setSelectedModuleBtn('guns'));
              }}
            >
              <GiGunshot className='module-icon' />
              <p>Gun</p>
            </button>
            <button
              className={selectedModuleBtn === 'suspensions' ? 'active' : ''}
              disabled={!selected}
              onClick={() => {
                dispatch(resetModuleId());
                dispatch(setSelectedModuleBtn('suspensions'));
              }}
            >
              <GiTankTread className='module-icon' />
              <p>Suspension</p>
            </button>
            <button
              className={selectedModuleBtn === 'engines' ? 'active' : ''}
              disabled={!selected}
              onClick={() => {
                dispatch(resetModuleId());
                dispatch(setSelectedModuleBtn('engines'));
              }}
            >
              <PiEngineFill className='module-icon' />
              <p>Engine</p>
            </button>
            <button
              className={selectedModuleBtn === 'radios' ? 'active' : ''}
              disabled={!selected}
              onClick={() => {
                dispatch(resetModuleId());
                dispatch(setSelectedModuleBtn('radios'));
              }}
            >
              <RiRadioFill className='module-icon' />
              <p>Radio</p>
            </button>
            {/* <button
              className={openModule === 'ammo' ? 'active' : ''}
              disabled={!selected.tank_id}
              onClick={() => setOpenModule('ammo')}
            >
              <GiBullets className='module-icon' />
              <p>Ammo</p>
            </button> */}
          </div>
          <div className='selection-header'>
            <p>MODULES:</p>
          </div>
          <div className='module-selection'>{moduleSelection}</div>
          <div className='selection-header'>
            <p>MODULE INFO:</p>
          </div>
          <div className='module-info'>
            <ModuleInfo />
          </div>
        </div>
        <div className='selected-btn-section'>
          <button
            type='button'
            disabled={!selected}
            onClick={() => {
              if (flagUpdateMain) {
                // {tank: obj, flag: flag1 || flag2 }
                dispatch(tankModify({ tank: staged, flag: 'flagUpdateMain' }));
                dispatch(restoreDefaults());
              } else if (flagUpdateSub) {
                // {tank: obj, columnIndex: columnIndex, flag: flag1 || flag2 }
                dispatch(
                  tankModify({
                    tank: staged,
                    columnNumber: columnNumber,
                    flag: 'flagUpdateSub',
                  })
                );
                dispatch(restoreDefaults());
              } else {
                dispatch(tankAdded(staged));
                dispatch(restoreDefaults());
              }
            }}
          >
            <GiSave className='module-icon active' />
            <p>Save</p>
          </button>
          <button
            type='button'
            onClick={() => {
              dispatch(restoreDefaults());
            }}
          >
            <GiCancel className='module-icon' />
            <p>Cancel</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectedContainer;
