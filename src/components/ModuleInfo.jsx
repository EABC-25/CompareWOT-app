import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { nanoid } from 'nanoid';
import { useGetModuleQuery } from '../api/apiSlice';
import {
  changeSelectedModule,
  changeModuleInStaging,
  getStagedObject,
  getSelectedModulesValues,
} from '../redux/tanksSlice';

import { createModuleObjByType } from '../utils/utils';
import Loading from './Loading';
import { toast } from 'react-toastify';

const removeUnderscore = string => {
  const newString = string.replace(/_/g, ' ');
  return newString;
};

const modifyValues = array => {
  if (array[0] === 'weight') {
    const newValue = `${array[1]} kg`;
    return [array[0], newValue];
  } else if (array[0] === 'load limit') {
    const newValue = `${array[1]} kg`;
    return [array[0], newValue];
  } else if (array[0] === 'power') {
    const newValue = `${array[1]} kw`;
    return [array[0], newValue];
  } else if (array[0] === 'view range') {
    const newValue = `${array[1]} meters`;
    return [array[0], newValue];
  } else if (array[0] === 'signal range') {
    const newValue = `${array[1]} meters`;
    return [array[0], newValue];
  } else if (array[0].includes('arc') || array[0].includes('angle')) {
    const newValue = `${array[1]} degrees`;
    return [array[0], newValue];
  } else if (array[0].includes('speed')) {
    const newValue = `${array[1]} km/h`;
    return [array[0], newValue];
  } else if (array[0] === 'fire rate') {
    const newValue = `${array[1]} shells per minute`;
    return [array[0], newValue];
  } else if (array[0].includes('time')) {
    const newValue = `${array[1]} seconds`;
    return [array[0], newValue];
  } else if (array[0] === 'fire chance') {
    const newValue = `${array[1] * 100}%`;
    return [array[0], newValue];
  } else {
    return array;
  }
};

const ModuleInfo = () => {
  const dispatch = useDispatch();
  const staged = useSelector(getStagedObject);
  const { selectedModuleId, selectedModuleBtn } = useSelector(
    getSelectedModulesValues
  );

  const initModule = useCallback(async (data, module_type) => {
    const newData = await createModuleObjByType(data, module_type);
    dispatch(changeModuleInStaging(newData));
  }, []);

  const moduleTag = selectedModuleBtn?.slice(0, -1).toUpperCase();

  const { currentData, isLoading, isFetching, isSuccess, isError, error } =
    useGetModuleQuery(
      selectedModuleId
        ? {
            tank_id: staged.tank_id,
            module_id: selectedModuleId,
            module_type: moduleTag.toLowerCase(),
          }
        : null,
      {
        skip: selectedModuleId ? false : true,
      }
    );

  useEffect(() => {
    if (currentData !== undefined && currentData?.status !== 'error') {
      initModule(currentData, moduleTag.toLowerCase());
    } else if (currentData?.status === 'error') {
      dispatch(changeSelectedModule('default'));
      toast.error('Module unavailable');
    }
  }, [currentData]);

  let moduleInfo = (
    <div className='module-div-empty'>
      <h4>ON STANDBY FOR DATA RECEPTION..</h4>
    </div>
  );

  let moduleEntries = staged?.profileModule[moduleTag.toLowerCase()]
    ? Object.entries(staged.profileModule[moduleTag.toLowerCase()])
    : null;

  if (isLoading || isFetching) {
    moduleInfo = (
      <div className='module-div-empty'>
        <Loading size='1rem' />
      </div>
    );
  } else if (staged) {
    if (moduleTag.toLowerCase() === 'turret') {
      if (moduleEntries?.length === 0) {
        moduleInfo = (
          <div className='module-div-empty'>
            <h4>NONE SELECTED</h4>
          </div>
        );
      } else {
        let armorInfo = moduleEntries.slice(-1);
        armorInfo = armorInfo[0][1] && Object.entries(armorInfo[0][1]);
        moduleEntries = moduleEntries.slice(0, -1);
        moduleEntries = moduleEntries.map(array => {
          const arrayKey = removeUnderscore(array[0]);
          let newArray = [arrayKey, array[1]];
          newArray = modifyValues(newArray);
          return newArray;
        });

        moduleInfo = (
          <div className='module-info-content'>
            {moduleEntries.map(entry => {
              return (
                <div className='module-info-cell' key={nanoid()}>
                  <p className='key'>{entry[0]}:</p>
                  <p className='value'>{entry[1]}</p>
                </div>
              );
            })}
            {armorInfo ? (
              <div className='module-info-cell sub-cell'>
                <p className='key header'>Armor:</p>
                <div className='container'>
                  <div className='sub-cell'>
                    <p className='key'>{armorInfo[0][0]}:</p>
                    <p>{armorInfo[0][1]}</p>
                  </div>
                  <div className='sub-cell'>
                    <p className='key'>{armorInfo[1][0]}:</p>
                    <p>{armorInfo[1][1]}</p>
                  </div>
                  <div className='sub-cell'>
                    <p className='key'>{armorInfo[2][0]}:</p>
                    <p>{armorInfo[2][1]}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className='module-info-cell'>
                <p className='key'>Armor:</p>
                <p className='value'>N/A</p>
              </div>
            )}
          </div>
        );
      }
    } else {
      moduleEntries = moduleEntries.map(array => {
        const arrayKey = removeUnderscore(array[0]);
        let newArray = [arrayKey, array[1]];
        newArray = modifyValues(newArray);
        return newArray;
      });

      moduleInfo = (
        <div className='module-info-content'>
          {moduleEntries.map(entry => {
            return (
              <div className='module-info-cell' key={nanoid()}>
                <p className='key'>{entry[0]}:</p>
                <p className='value'>{entry[1]}</p>
              </div>
            );
          })}
        </div>
      );
    }
  } else if (isError) {
    moduleInfo = (
      <div className='module-div-empty'>
        <h4>MODULE UNAVAILABLE, PLEASE TRY AGAIN..</h4>
      </div>
    );
  }

  return <>{moduleInfo}</>;
};

export default ModuleInfo;
