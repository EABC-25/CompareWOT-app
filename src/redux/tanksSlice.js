import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { apiSlice } from '../api/apiSlice';
import {
  calculateDPM,
  createModuleObj,
  createTankObj,
  updateURL,
  changeProfileId,
  compareValues,
} from '../utils/utils';

import { toast } from 'react-toastify';

const tiers = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
const types = [
  'Light Tank',
  'Medium Tank',
  'Heavy Tank',
  'Tank Destroyer',
  'SPG',
];

const initialState = {
  columnCount: 0,
  fixedSectionButtons: false,
  loadState: {
    compareAppIsLoading: false,
    appLoadingError: false,
  },
  isModalOpen: false,
  displayValues: {
    baseValuesOn: false,
  },
  baseValues: {
    toCompareWith: null,
    inComparisonTable: [],
    compareResults: {},
  },
  effectiveValues: {
    toCompareWith: null,
    inComparisonTable: [],
    compareResults: {},
  },
  updateFlags: {
    fetchTanksFlag: false,
    fetchTankFlag: false,
    flagUpdateMain: false,
    flagUpdateSub: false,
    columnNumber: null,
  },

  selectedTanksValues: {
    selected: null,
    selectedTier: null,
    selectedType: null,
    selectedNation: null,
  },
  selectedModulesValues: {
    selectedModuleBtn: 'turrets',
    selectedModuleId: null,
  },

  stagingArea: null,
  copyForBaseValue: null,
  urlBookmarkArray: [],
};

export const fetchUrlBookmarkedTanks = createAsyncThunk(
  'tanks/fetchUrlBookmarkedTanks',
  async (_, thunkAPI) => {
    // WHAT IF USER MODIFIED THE URL? HOW DO WE FETCHED POTENTIALLY TAMPERED URL QUERY PARAMS???????

    const url = window.location.href;
    // Split URL from '?' into an array of 2 values, origin at index 0 and params/query at index 1
    const urlSplit = url.split('?');
    // const origin = urlSplit[0];
    // split params from '&' into an array of multiple values
    // slice further to control item/tank count to only 8 (1 main and 7 inComparisonTable)
    const params = urlSplit[1].split('&').slice(0, 8);
    // slice the array from index 1, effectively removing first value in the array - that value is the main tank used for comparison
    // let toCompareParams = params[0];
    // let inComparisonParams = params.slice(1);

    try {
      // initiate tankIdUrlArrayed and profileIdUrlArrayed empty array variables
      let tankIdUrlArrayed = [];
      let profileIdUrlArrayed = [];

      // loop through the params array, split the value per loop from '=' then take index 0 to get tank_id and index 1 for the profile_id
      // afterwards push the tank_id to the tankIdUrl variable
      params.forEach((param, idx) => {
        const split = param.split('=');
        const tank_id = split[0];
        const profile_id = split[1];
        tankIdUrlArrayed.push(tank_id);
        profileIdUrlArrayed.push(profile_id);
      });
      let baseValuesData = [];
      let effectiveValuesData = [];

      for (let i = 0; i <= tankIdUrlArrayed.length - 1; i++) {
        const response1 = thunkAPI.dispatch(
          apiSlice.endpoints.getTank.initiate(tankIdUrlArrayed[i])
        );
        const data1 = await response1.unwrap();
        const response2 = thunkAPI.dispatch(
          apiSlice.endpoints.getProfile.initiate({
            tank_id: tankIdUrlArrayed[i],
            profile_id: profileIdUrlArrayed[i],
          })
        );
        const data2 = await response2.unwrap();
        if (
          data1 === undefined ||
          data2 === undefined ||
          data1.status === 'error' ||
          data2.status === 'error'
        ) {
          baseValuesData.push(data1);
          effectiveValuesData.push(data2);
        } else {
          baseValuesData.push(data1[0]);
          effectiveValuesData.push({ ...data1[0], default_profile: data2 });
        }
      }
      let baseValuesObj = [];
      let effectiveValuesObj = [];

      for (let j = 0; j <= effectiveValuesData.length - 1; j++) {
        if (
          baseValuesData[j] === undefined ||
          effectiveValuesData[j] === undefined ||
          baseValuesData[j].status === 'error' ||
          effectiveValuesData[j].status === 'error'
        ) {
          baseValuesObj.push(baseValuesData[j]);
          effectiveValuesObj.push(effectiveValuesData[j]);
        } else {
          const newDataEff = await createTankObj(effectiveValuesData[j]);
          const newDataBase = await createTankObj(baseValuesData[j]);

          const {
            modules: modules1,
            profileModule: profileModule1,
            profileId: profileId1,
            profileIdStr: profileIdStr1,
            defaultProfileId: defaultProfileId1,
            defaultProfileIdStr: defaultProfileIdStr1,
          } = await createModuleObj(
            effectiveValuesData[j],
            profileIdUrlArrayed[j].split('-').map(id => parseInt(id))
          );

          const {
            modules: modules2,
            profileModule: profileModule2,
            profileId: profileId2,
            profileIdStr: profileIdStr2,
            defaultProfileId: defaultProfileId2,
            defaultProfileIdStr: defaultProfileIdStr2,
          } = await createModuleObj(baseValuesData[j]);

          const compiledEff = {
            ...newDataEff,
            modules: modules1,
            profileModule: profileModule1,
            profileId: profileId1,
            profileIdStr: profileIdStr1,
            defaultProfileId: defaultProfileId1,
            defaultProfileIdStr: defaultProfileIdStr1,
          };

          const compiledBase = {
            ...newDataBase,
            modules: modules2,
            profileModule: profileModule2,
            profileId: profileId2,
            profileIdStr: profileIdStr2,
            defaultProfileId: defaultProfileId2,
            defaultProfileIdStr: defaultProfileIdStr2,
          };

          effectiveValuesObj.push(compiledEff);
          baseValuesObj.push(compiledBase);
        }
      }
      return { baseValuesObj, effectiveValuesObj };
    } catch (err) {
      return { status: 'catch error' };
    }
  }
);

const tanksSlice = createSlice({
  name: 'tanks',
  initialState,
  reducers: {
    setFixedSectionButtons: {
      reducer(state, action) {
        state.fixedSectionButtons = action.payload;
      },
    },
    changeDisplayValues: {
      reducer(state, action) {
        state.displayValues.baseValuesOn = action.payload;
      },
    },
    toggleModal: {
      reducer(state) {
        state.isModalOpen = !state.isModalOpen;
      },
    },
    tankAdded: {
      reducer(state, action) {
        state.displayValues.baseValuesOn = false;
        if (!state.effectiveValues.toCompareWith) {
          // NEEDS TO FIX ERROR WITH NON TURRETED TANKS
          state.effectiveValues.toCompareWith = action.payload;
          state.baseValues.toCompareWith = state.copyForBaseValue;
        } else if (state.effectiveValues.toCompareWith) {
          const compareResultsBase = compareValues(
            state.baseValues.toCompareWith,
            state.copyForBaseValue
          );

          const compareResultsEffective = compareValues(
            state.effectiveValues.toCompareWith,
            action.payload
          );

          state.baseValues.inComparisonTable = [
            ...state.baseValues.inComparisonTable,
            {
              ...state.copyForBaseValue,
              compareResults: compareResultsBase,
              columnNumber: state.baseValues.inComparisonTable.length,
            },
          ];

          state.effectiveValues.inComparisonTable = [
            ...state.effectiveValues.inComparisonTable,
            {
              ...action.payload,
              compareResults: compareResultsEffective,
              columnNumber: state.effectiveValues.inComparisonTable.length,
            },
          ];

          // STILL THINKING IF I SHOULD CREATE A SEPARATE COMPARERESULTS STATE...
          // state.compareResults[action.payload.tank_id] = compareResults;
        }
        const bookmark = `${action.payload.tank_id}=${action.payload.profileIdStr}`;
        state.urlBookmarkArray.push(bookmark);
        updateURL(state.urlBookmarkArray.join('&'));
        state.columnCount += 1;
      },
    },
    tankModify: {
      reducer(state, action) {
        const { tank, columnNumber, flag } = action.payload;

        state.displayValues.baseValuesOn = false;
        if (flag === 'flagUpdateMain') {
          if (state.effectiveValues.inComparisonTable.length > 0) {
            const reComparedEffective =
              state.effectiveValues.inComparisonTable.map(obj => {
                const compareResults = compareValues(tank, obj);
                return { ...obj, compareResults: compareResults };
              });
            state.effectiveValues.inComparisonTable = reComparedEffective;

            const reComparedBase = state.baseValues.inComparisonTable.map(
              obj => {
                const compareResults = compareValues(
                  state.copyForBaseValue,
                  obj
                );
                return { ...obj, compareResults: compareResults };
              }
            );
            state.baseValues.inComparisonTable = reComparedBase;
          }
          const bookmark = `${tank.tank_id}=${tank.profileIdStr}`;
          state.urlBookmarkArray[0] = bookmark;
          updateURL(state.urlBookmarkArray.join('&'));

          state.effectiveValues.toCompareWith = tank;
          state.baseValues.toCompareWith = state.copyForBaseValue;
        } else if (flag === 'flagUpdateSub') {
          const compareResultsEffective = compareValues(
            state.effectiveValues.toCompareWith,
            tank
          );
          const compareResultsBase = compareValues(
            state.baseValues.toCompareWith,
            state.copyForBaseValue
          );
          const updatedEffective = {
            ...tank,
            columnNumber: columnNumber,
            compareResults: compareResultsEffective,
          };
          const updatedBase = {
            ...state.copyForBaseValue,
            columnNumber: columnNumber,
            compareResults: compareResultsBase,
          };
          const bookmark = `${tank.tank_id}=${tank.profileIdStr}`;
          state.urlBookmarkArray[columnNumber + 1] = bookmark;
          updateURL(state.urlBookmarkArray.join('&'));

          state.effectiveValues.inComparisonTable[columnNumber] =
            updatedEffective;
          state.baseValues.inComparisonTable[columnNumber] = updatedBase;
        }
      },
    },
    tankDelete: {
      reducer(state, action) {
        state.urlBookmarkArray = state.urlBookmarkArray.filter(
          (_, idx) => idx !== action.payload + 1
        );
        updateURL(state.urlBookmarkArray.join('&'));
        const baseFiltered = state.baseValues.inComparisonTable.filter(
          tank => tank.columnNumber !== action.payload
        );
        const effFiltered = state.effectiveValues.inComparisonTable.filter(
          tank => tank.columnNumber !== action.payload
        );
        const baseColumnNumberAdjusted = baseFiltered.map((tank, idx) => {
          tank.columnNumber = idx;
          return tank;
        });
        const effColumnNumberAdjusted = effFiltered.map((tank, idx) => {
          tank.columnNumber = idx;
          return tank;
        });

        state.baseValues.inComparisonTable = baseColumnNumberAdjusted;
        state.effectiveValues.inComparisonTable = effColumnNumberAdjusted;
        state.columnCount -= 1;
      },
    },
    openSelect: {
      reducer(state) {
        state.updateFlags.fetchTanksFlag = true;
        state.updateFlags.fetchTankFlag = false;
        state.selectedTanksValues.selectedTier = 6;
        state.selectedTanksValues.selectedType = types[1];
        state.selectedTanksValues.selectedNation = 'All';
        state.isModalOpen = true;
      },
    },
    openUpdate: {
      reducer(state, action) {
        if (action.payload.flag === 'openUpdateMain') {
          state.updateFlags.flagUpdateMain = true;
          state.copyForBaseValue = state.baseValues.toCompareWith;
          state.stagingArea = state.effectiveValues.toCompareWith;
        } else if (action.payload.flag === 'openUpdateSub') {
          state.updateFlags.flagUpdateSub = true;
          state.updateFlags.columnNumber = action.payload.columnNumber;
          state.copyForBaseValue =
            state.baseValues.inComparisonTable[action.payload.columnNumber];
          state.stagingArea =
            state.effectiveValues.inComparisonTable[
              action.payload.columnNumber
            ];
        }
        state.updateFlags.fetchTanksFlag = true;
        state.updateFlags.fetchTankFlag = false;
        state.selectedTanksValues.selected = action.payload.tank.tank_id;
        state.selectedTanksValues.selectedTier =
          tiers.indexOf(action.payload.tank.tier) + 1;
        state.selectedTanksValues.selectedType = action.payload.tank.type;
        state.selectedTanksValues.selectedNation = 'All';
        state.isModalOpen = true;
      },
    },
    restoreDefaults: {
      reducer(state) {
        state.updateFlags.fetchTanksFlag = false;
        state.updateFlags.fetchTankFlag = false;
        state.updateFlags.flagUpdateMain = false;
        state.updateFlags.flagUpdateSub = false;
        state.updateFlags.columnNumber = null;
        state.selectedTanksValues.selected = null;
        state.selectedModulesValues.selectedModuleBtn = 'turrets';
        state.selectedModulesValues.selectedModuleId = null;
        state.selectedTanksValues.selectedTier = null;
        state.selectedTanksValues.selectedType = null;
        state.selectedTanksValues.selectedNation = null;
        state.stagingArea = null;
        state.copyForBaseValue = null;
        state.isModalOpen = false;
      },
    },
    resetModuleId: {
      reducer(state) {
        state.selectedModulesValues.selectedModuleId = null;
      },
    },
    setSelected: {
      reducer(state, action) {
        state.updateFlags.fetchTankFlag = true;
        state.selectedTanksValues.selected = action.payload;
      },
    },
    setSelectedTier: {
      reducer(state, action) {
        state.selectedTanksValues.selectedTier = action.payload;
      },
    },
    setSelectedType: {
      reducer(state, action) {
        state.selectedTanksValues.selectedType = action.payload;
      },
    },
    setSelectedNation: {
      reducer(state, action) {
        state.selectedTanksValues.selectedNation = action.payload;
      },
    },
    setProfileId: {
      reducer(state, action) {
        let arrayCopy = action.payload.array;
        arrayCopy.push(action.payload.id);
        arrayCopy.sort((a, b) => a - b);
        const profile_id_str = arrayCopy.join('-');
        state.updateFlags.profile_id = profile_id_str;
      },
    },
    setStagingArea: {
      reducer(state, action) {
        state.stagingArea = action.payload;
      },
    },
    setCopyForBaseValue: {
      reducer(state, action) {
        state.copyForBaseValue = action.payload;
      },
    },
    changeModuleInStaging: {
      reducer(state, action) {
        const moduleTag = state.selectedModulesValues.selectedModuleBtn
          .slice(0, -1)
          .toLowerCase();
        if (moduleTag === 'gun') {
          state.stagingArea.profileModule.gun = action.payload.gun;
          state.stagingArea.profileModule.ammo = action.payload.ammo;
          state.stagingArea.firepower.DPM = calculateDPM(
            action.payload.ammo[0].damage[1],
            action.payload.gun.fire_rate
          );
          state.stagingArea.firepower.penetration =
            action.payload.ammo[0].penetration[1];
          state.stagingArea.firepower.damage = action.payload.ammo[0].damage[1];
          state.stagingArea.firepower['rate of fire'] =
            action.payload.gun.fire_rate;
          state.stagingArea.firepower['reload time'] =
            action.payload.gun.reload_time;
          state.stagingArea.firepower.caliber = action.payload.gun.caliber;
          state.stagingArea.firepower['ammo capacity'] =
            action.payload.gun.max_ammo;
          state.stagingArea.firepower['potential damage'] =
            action.payload.gun.max_ammo * action.payload.ammo[0].damage[1];
          state.stagingArea.gunHandling['aim time'] =
            action.payload.gun.aim_time;
          state.stagingArea.gunHandling.dispersion =
            action.payload.gun.dispersion;
          state.stagingArea.gunHandling.elevation =
            action.payload.gun.move_up_arc;
          state.stagingArea.gunHandling.depression =
            action.payload.gun.move_down_arc;
        } else if (moduleTag === 'engine') {
          state.stagingArea.profileModule[moduleTag] =
            action.payload[moduleTag];
          state.stagingArea.mobility['forward speed'] =
            action.payload.engine.speed_forward;
          state.stagingArea.mobility['reverse speed'] =
            action.payload.engine.speed_backward;
          state.stagingArea.mobility['engine power'] =
            action.payload.engine.power;
          state.stagingArea.miscellaneous['fire chance'] =
            action.payload.engine.fire_chance * 100;
        } else if (moduleTag === 'turret') {
          state.stagingArea.profileModule[moduleTag] =
            action.payload[moduleTag];
          const turretArmor = [
            action.payload.turret.armor?.front ?? 'n/a',
            action.payload.turret.armor?.sides ?? 'n/a',
            action.payload.turret.armor?.rear ?? 'n/a',
          ];
          state.stagingArea.armorAndHealth['turret armor'] = turretArmor;
          state.stagingArea.miscellaneous['view range'] =
            action.payload.turret.view_range;
        } else if (moduleTag === 'radio') {
          state.stagingArea.profileModule[moduleTag] =
            action.payload[moduleTag];
          state.stagingArea.miscellaneous['radio range'] =
            action.payload.radio.signal_range;
        } else if (moduleTag === 'suspension') {
          state.stagingArea.profileModule[moduleTag] =
            action.payload[moduleTag];
        }

        state.stagingArea.mobility.weight =
          state.stagingArea.hull.hull_weight +
          state.stagingArea.profileModule.engine.weight +
          state.stagingArea.profileModule.gun.weight +
          state.stagingArea.profileModule.radio.weight +
          state.stagingArea.profileModule.suspension.weight +
          state.stagingArea.profileModule.turret.weight;
        state.stagingArea.armorAndHealth.health =
          state.stagingArea.hull.hull_hp +
          state.stagingArea.profileModule.turret.hp;
      },
    },
    changeSelectedModule: {
      reducer(state, action) {
        state.stagingArea.modules[
          state.selectedModulesValues.selectedModuleBtn
        ] = state.stagingArea.modules[
          state.selectedModulesValues.selectedModuleBtn
        ].map(m => {
          m.selected = false;
          return m;
        });

        if (action.payload === 'default') {
          let default_id;
          state.stagingArea.modules[
            state.selectedModulesValues.selectedModuleBtn
          ] = state.stagingArea.modules[
            state.selectedModulesValues.selectedModuleBtn
          ].map(m => {
            if (m.is_default) {
              m.selected = true;
              default_id = m.module_id;
            }
            return m;
          });

          state.stagingArea.profileId = state.stagingArea.defaultProfileId;
          state.stagingArea.profileIdStr =
            state.stagingArea.defaultProfileIdStr;
          state.selectedModulesValues.selectedModuleId = default_id;
        } else {
          state.stagingArea.modules[
            state.selectedModulesValues.selectedModuleBtn
          ] = state.stagingArea.modules[
            state.selectedModulesValues.selectedModuleBtn
          ].map(m => {
            if (m.module_id === action.payload.new) {
              m.selected = true;
            }
            return m;
          });

          const { newProfileId, profileIdStr } = changeProfileId(
            state.stagingArea.profileIdStr,
            action.payload.current,
            action.payload.new
          );

          state.stagingArea.profileId = newProfileId;
          state.stagingArea.profileIdStr = profileIdStr;
          state.selectedModulesValues.selectedModuleId = action.payload.new;
        }
      },
    },
    setSelectedModuleBtn: {
      reducer(state, action) {
        state.selectedModulesValues.selectedModuleBtn = action.payload;
      },
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUrlBookmarkedTanks.pending, state => {
        state.loadState.compareAppIsLoading = true;
      })
      .addCase(fetchUrlBookmarkedTanks.fulfilled, (state, action) => {
        if (action.payload.status === 'catch error') {
          toast(`Error: Failure to connect, please try again later.`);
          // REDIRECT? OR SHOW ERROR PAGE
          return;
        }
        state.displayValues.baseValuesOn = false;
        if (action.payload.effectiveValuesObj)
          action.payload.effectiveValuesObj.forEach((tank, idx) => {
            if (tank.status !== 'error') {
              if (!state.effectiveValues.toCompareWith) {
                state.effectiveValues.toCompareWith = tank;
                state.baseValues.toCompareWith =
                  action.payload.baseValuesObj[idx];
              } else if (state.effectiveValues.toCompareWith) {
                const compareResultsBase = compareValues(
                  state.baseValues.toCompareWith,
                  action.payload.baseValuesObj[idx]
                );

                const compareResultsEffective = compareValues(
                  state.effectiveValues.toCompareWith,
                  tank
                );

                state.baseValues.inComparisonTable = [
                  ...state.baseValues.inComparisonTable,
                  {
                    ...action.payload.baseValuesObj[idx],
                    compareResults: compareResultsBase,
                    columnNumber: state.baseValues.inComparisonTable.length,
                  },
                ];

                state.effectiveValues.inComparisonTable = [
                  ...state.effectiveValues.inComparisonTable,
                  {
                    ...tank,
                    compareResults: compareResultsEffective,
                    columnNumber:
                      state.effectiveValues.inComparisonTable.length,
                  },
                ];
              }
              const bookmark = `${tank.tank_id}=${tank.profileIdStr}`;
              state.urlBookmarkArray.push(bookmark);
              state.columnCount += 1;
            } else {
              toast(`Error: Failure to load bookmarked Tank #${idx + 1}`);
              return;
            }
          });
        updateURL(state.urlBookmarkArray.join('&'));
        state.loadState.compareAppIsLoading = false;
      })
      .addCase(fetchUrlBookmarkedTanks.rejected, (state, action) => {
        state.loadState.compareAppIsLoading = false;
        //toast?? or redirect to error page??
      });
  },
});

export const {
  setFixedSectionButtons,
  changeDisplayValues,
  toggleModal,
  tankAdded,
  tankModify,
  tankDelete,
  openSelect,
  openUpdate,
  restoreDefaults,
  setSelected,
  setSelectedTier,
  setSelectedType,
  setSelectedNation,
  resetModuleId,
  setTypeAndTierToDefault,
  setTypeAndTierToNull,
  setProfileId,
  setStagingArea,
  setCopyForBaseValue,
  setSelectedModuleBtn,
  changeSelectedModule,
  changeModuleInStaging,
} = tanksSlice.actions;

export default tanksSlice.reducer;

export const getFixedSectionButtonStatus = state =>
  state.tanks.fixedSectionButtons;
export const getColumnCount = state => state.tanks.columnCount;
export const getLoadStatus = state => state.tanks.loadState;
export const getModalStatus = state => state.tanks.isModalOpen;
export const getSelectedValues = state => state.tanks.selectedTanksValues;
export const getSelectedModulesValues = state =>
  state.tanks.selectedModulesValues;
export const getSelected = state => state.tanks.selected;
export const getSelectedTier = state => state.tanks.selectedTier;
export const getSelectedType = state => state.tanks.selectedType;
export const getSelectedNation = state => state.tanks.selectedNation;
export const getUpdateFlagStatus = state => state.tanks.updateFlags;
export const selectToCompareWith = state => state.tanks.toCompareWith;
export const selectInComparisonTable = state => state.tanks.inComparisonTable;
export const getStagedObject = state => state.tanks.stagingArea;
export const getDisplayValuesStatus = state => state.tanks.displayValues;
export const getBaseValues = state => state.tanks.baseValues;
export const getEffectiveValues = state => state.tanks.effectiveValues;
