import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { nanoid } from 'nanoid';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  setFixedSectionButtons,
  getColumnCount,
  getLoadStatus,
  fetchUrlBookmarkedTanks,
  getDisplayValuesStatus,
} from './redux/tanksSlice';

import SectionColumn from './components/SectionColumn';
import Overlay from './components/Overlay';
import Logger from './utilityComponents/Logger';
import Loading from './components/Loading';

export default function App() {
  const dispatch = useDispatch();
  const { size } = new URLSearchParams(useLocation().search);
  const navRef = useRef(null);
  const referenceRef = useRef(null);
  const columnCount = useSelector(getColumnCount);
  const { compareAppIsLoading } = useSelector(getLoadStatus);
  const { baseValuesOn } = useSelector(getDisplayValuesStatus);
  const { toCompareWith, inComparisonTable } = useSelector(state => {
    if (baseValuesOn) {
      return state.tanks.baseValues;
    } else {
      return state.tanks.effectiveValues;
    }
  });

  useEffect(() => {
    if (size > 0) {
      dispatch(fetchUrlBookmarkedTanks());
    }
  }, []);

  let content;

  if (compareAppIsLoading) {
    content = (
      <div className='app-content'>
        <Loading />
      </div>
    );
  } else {
    content = (
      <div
        className='app-content'
        onScroll={() => {
          const nav = navRef.current.getBoundingClientRect();
          const refPoint =
            referenceRef.current.children[0].children[0].getBoundingClientRect();
          if (refPoint.bottom + 20 <= nav.bottom) {
            dispatch(setFixedSectionButtons(true));
          } else {
            dispatch(setFixedSectionButtons(false));
          }
        }}
      >
        <Overlay />
        <section className='column-container' ref={referenceRef}>
          <SectionColumn columnState='default' />
          {toCompareWith && (
            <SectionColumn
              key={nanoid()}
              columnState='main'
              obj={toCompareWith}
            />
          )}
          {toCompareWith &&
            inComparisonTable.length > 0 &&
            inComparisonTable.map((obj, idx) => {
              if (idx < 7) {
                return (
                  <SectionColumn
                    key={nanoid()}
                    columnState='active'
                    obj={obj}
                  />
                );
              }
            })}
          {columnCount < 8 && <SectionColumn />}
        </section>
      </div>
    );
  }

  return (
    <>
      <main>
        <Logger />
        <nav ref={navRef}>
          <h1>COMPAREWOT?</h1>
        </nav>
        {content}
        <ToastContainer position='bottom-right' />
        <footer>
          <span>
            COMPAREWOT? is a personal project created to study and practice web
            dev tools using World of Tanks API data trademarked by:&nbsp;
            <a target='_blank' href='https://wargaming.net'>
              Wargaming.net.
            </a>
          </span>
          <span>
            COMPAREWOT? is inspired by the player created website:&nbsp;
            <a target='_blank' href='https://tanks.gg/compare'>
              Tanks.gg/compare.
            </a>
          </span>
        </footer>
      </main>
    </>
  );
}
