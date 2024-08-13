import { useSelector, useDispatch } from 'react-redux';
import {
  getStagedObject,
  getSelectedModulesValues,
  changeSelectedModule,
} from '../redux/tanksSlice';
import Loading from './Loading';

const ModuleSelection = ({ status }) => {
  const dispatch = useDispatch();
  const staged = useSelector(getStagedObject);
  const { selectedModuleBtn } = useSelector(getSelectedModulesValues);

  const moduleTag = selectedModuleBtn?.slice(0, -1).toUpperCase();

  let moduleContent = (
    <div className='module-div-empty'>
      <h4>ON STANDBY FOR DATA RECEPTION..</h4>
    </div>
  );

  if (status === 'loading') {
    moduleContent = (
      <div className='module-div-empty'>
        <Loading size='1rem' />
      </div>
    );
  } else if (status === 'success') {
    if (
      staged.modules[selectedModuleBtn]?.length === 0 ||
      !staged.modules[selectedModuleBtn]
    ) {
      if (
        staged.general.type === 'SPG' ||
        staged.general.type === 'Tank Destroyer'
      ) {
        moduleContent = (
          <>
            <form></form>
            <div className='module-last-child'>
              <span>
                <p>{`<<<  BASE MODULE ONLY AVAILABLE FOR TD AND SPG >>>`}</p>
              </span>
            </div>
          </>
        );
      } else {
        moduleContent = (
          <>
            <form></form>
            <div className='module-last-child'>
              <span>
                <p>{`<<<  NO MODULES FOUND  >>>`}</p>
              </span>
            </div>
          </>
        );
      }
    } else {
      moduleContent = (
        <>
          <form>
            {staged.modules[selectedModuleBtn].map(module => {
              return (
                <div key={module.module_id} className='module'>
                  <input
                    type='radio'
                    checked={module.selected}
                    onChange={() => {
                      const s = staged.modules[selectedModuleBtn].find(
                        m => m.selected
                      );
                      if (s.module_id !== module.module_id) {
                        dispatch(
                          changeSelectedModule({
                            current: s.module_id,
                            new: module.module_id,
                          })
                        );
                      }
                    }}
                  />
                  <label>
                    <h4>
                      <span>{moduleTag} MODULE:</span>&nbsp;&nbsp; {module.name}
                    </h4>
                  </label>
                </div>
              );
            })}
          </form>

          <div className='module-last-child'>
            <span>
              <p>{'<<<  END OF LIST  >>>'}</p>
            </span>
          </div>
        </>
      );
    }
  } else if (status === 'error') {
    moduleContent = (
      <div className='module-div-empty'>
        <h4>DATA RECEPTION FAILED, PLEASE TRY AGAIN..</h4>
      </div>
    );
  }

  return <>{moduleContent}</>;
};

export default ModuleSelection;
