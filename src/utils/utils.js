import china from '../assets/flags/china.svg';
import czech from '../assets/flags/czech.svg';
import france from '../assets/flags/france.svg';
import germany from '../assets/flags/germany.svg';
import italy from '../assets/flags/italy.svg';
import japan from '../assets/flags/japan.svg';
import poland from '../assets/flags/poland.svg';
import sweden from '../assets/flags/sweden.svg';
import uk from '../assets/flags/uk.svg';
import usa from '../assets/flags/usa.svg';
import ussr from '../assets/flags/ussr.svg';

export const flags = [
  {
    country: 'All',
    flag: '',
  },
  {
    country: 'China',
    flag: china,
  },
  {
    country: 'Czech',
    flag: czech,
  },
  {
    country: 'France',
    flag: france,
  },
  {
    country: 'Germany',
    flag: germany,
  },
  {
    country: 'Italy',
    flag: italy,
  },
  {
    country: 'Japan',
    flag: japan,
  },
  {
    country: 'Poland',
    flag: poland,
  },
  {
    country: 'Sweden',
    flag: sweden,
  },
  {
    country: 'UK',
    flag: uk,
  },
  {
    country: 'USA',
    flag: usa,
  },
  {
    country: 'USSR',
    flag: ussr,
  },
];

const tankTypeRes = {
  lightTank: 'Light Tank',
  mediumTank: 'Medium Tank',
  heavyTank: 'Heavy Tank',
  'AT-SPG': 'Tank Destroyer',
  SPG: 'SPG',
};

function returnTierType(data) {
  const tierType = {
    1: 'I',
    2: 'II',
    3: 'III',
    4: 'IV',
    5: 'V',
    6: 'VI',
    7: 'VII',
    8: 'VIII',
    9: 'IX',
    10: 'X',
  };
  return tierType[data];
}

export function calculateDPM(damage, fire_Rate) {
  // const minute = 1000 * 60;
  // const fireRate = minute / (reloadTime * 1000);
  // const DPM1 = fireRate * damage;
  let DPM = fire_Rate * damage;
  DPM = parseFloat(DPM.toFixed(2));

  return DPM;
}

export async function createModuleObjByType(obj, type) {
  let module = {};
  if (type === 'gun') {
    module.gun = {
      name: obj.gun.name,
      tier: obj.gun.tier,
      weight: obj.gun.weight,
      ...obj.gun,
      max_ammo: obj.max_ammo,
    };
    module.ammo = obj.ammo;
  } else if (type === 'engine') {
    module.engine = {
      name: obj.engine.name,
      tier: obj.engine.tier,
      weight: obj.engine.weight,
      ...obj.engine,
      speed_forward: obj.speed_forward,
      speed_backward: obj.speed_backward,
    };
  } else if (type === 'turret') {
    module.turret = {
      name: obj.turret.name,
      tier: obj.turret.tier,
      weight: obj.turret.weight,
      ...obj.turret,
      armor: obj.armor.turret,
    };
  } else if (type === 'radio') {
    module.radio = {
      name: obj.radio.name,
      tier: obj.radio.tier,
      weight: obj.radio.weight,
      ...obj.radio,
    };
  } else if (type === 'suspension') {
    module.suspension = {
      name: obj.suspension.name,
      tier: obj.suspension.tier,
      weight: obj.suspension.weight,
      ...obj.suspension,
    };
  }

  return module;
}

export async function createModuleObj(obj, profileId) {
  let moduleObj = {
    modules: {},
    profileModule: {},
    defaultProfileId: [],
    defaultProfileIdStr: '',
    profileId: [],
    profileIdStr: '',
  };

  moduleObj.modules.guns = obj.guns
    .map(id => {
      const { name, is_default, module_id } = obj.modules_tree[id];
      const selected = profileId ? profileId.includes(module_id) : is_default;
      if (is_default) {
        moduleObj.defaultProfileId.push(module_id);
      }
      return { name, is_default, module_id, selected };
    })
    .sort((a, b) => b.is_default - a.is_default);
  moduleObj.modules.radios = obj.radios
    .map(id => {
      const { name, is_default, module_id } = obj.modules_tree[id];
      const selected = profileId ? profileId.includes(module_id) : is_default;
      if (is_default) {
        moduleObj.defaultProfileId.push(module_id);
      }
      return { name, is_default, module_id, selected };
    })
    .sort((a, b) => b.is_default - a.is_default);
  moduleObj.modules.suspensions = obj.suspensions
    .map(id => {
      const { name, is_default, module_id } = obj.modules_tree[id];
      const selected = profileId ? profileId.includes(module_id) : is_default;
      if (is_default) {
        moduleObj.defaultProfileId.push(module_id);
      }
      return { name, is_default, module_id, selected };
    })
    .sort((a, b) => b.is_default - a.is_default);
  moduleObj.modules.engines = obj.engines
    .map(id => {
      const { name, is_default, module_id } = obj.modules_tree[id];
      const selected = profileId ? profileId.includes(module_id) : is_default;
      if (is_default) {
        moduleObj.defaultProfileId.push(module_id);
      }
      return { name, is_default, module_id, selected };
    })
    .sort((a, b) => b.is_default - a.is_default);
  moduleObj.modules.turrets = obj.turrets
    .map(id => {
      const { name, is_default, module_id } = obj.modules_tree[id];
      const selected = profileId ? profileId.includes(module_id) : is_default;
      if (is_default) {
        moduleObj.defaultProfileId.push(module_id);
      }
      return { name, is_default, module_id, selected };
    })
    .sort((a, b) => b.is_default - a.is_default);

  const { gun, ammo } = await createModuleObjByType(obj.default_profile, 'gun');
  const { engine } = await createModuleObjByType(obj.default_profile, 'engine');
  const { turret } = await createModuleObjByType(obj.default_profile, 'turret');
  const { radio } = await createModuleObjByType(obj.default_profile, 'radio');
  const { suspension } = await createModuleObjByType(
    obj.default_profile,
    'suspension'
  );

  moduleObj.profileModule.engine = engine;
  moduleObj.profileModule.gun = gun;
  moduleObj.profileModule.turret = turret;
  moduleObj.profileModule.radio = radio;
  moduleObj.profileModule.suspension = suspension;
  moduleObj.profileModule.ammo = ammo;
  //  moduleObj.profileModule.profile_id =

  moduleObj.defaultProfileId.sort((a, b) => a - b);
  moduleObj.defaultProfileIdStr = moduleObj.defaultProfileId.join('-');

  if (profileId) {
    moduleObj.profileId = profileId;
    moduleObj.profileId.sort((a, b) => a - b);
    moduleObj.profileIdStr = moduleObj.profileId.join('-');
  } else {
    moduleObj.profileId = moduleObj.defaultProfileId;
    moduleObj.profileIdStr = moduleObj.defaultProfileIdStr;
  }

  return moduleObj;
}

export async function createTankBasicInfoObj(obj) {
  let newObj = {
    tank_name: '',
    tank_id: '',
    largeImg: '',
    premium: '',
    general: {},
  };

  const upperCaseNation = ['uk', 'usa', 'ussr'];
  const capitalizedNation = [
    'china',
    'czech',
    'france',
    'germany',
    'italy',
    'japan',
    'poland',
    'sweden',
  ];

  const UPCREGEX = new RegExp(
    `^(${upperCaseNation
      .map(str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('|')})$`
  );
  const CAPREGEX = new RegExp(
    `^(${capitalizedNation
      .map(str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('|')})$`
  );
  let nation;
  if (CAPREGEX.test(obj.nation.trim())) {
    const fl = obj.nation.charAt(0).toUpperCase();
    const next = obj.nation.substring(1);
    nation = `${fl}${next}`;
  } else if (UPCREGEX.test(obj.nation.trim())) {
    nation = obj.nation.trim().toUpperCase();
  }

  newObj.tank_name = obj.name;
  newObj.tank_id = obj.tank_id;
  newObj.largeImg = obj.images.big_icon;
  newObj.premium = obj.is_premium;
  newObj.general.nation = nation;
  newObj.general.tier = returnTierType(obj.tier);
  // regex to match type - to follow
  newObj.general.type = tankTypeRes[obj.type];

  return newObj;
}

export async function createTankStatsInfoObj(obj) {
  let newObj = {
    firepower: {},
    gunHandling: {},
    mobility: {},
    armorAndHealth: {},
    miscellaneous: {},
    hull: {},
  };

  const hullArmor = [
    obj.armor.hull?.front ?? 'n/a',
    obj.armor.hull?.sides ?? 'n/a',
    obj.armor.hull?.rear ?? 'n/a',
  ];
  const turretArmor = [
    obj.armor.turret?.front ?? 'n/a',
    obj.armor.turret?.sides ?? 'n/a',
    obj.armor.turret?.rear ?? 'n/a',
  ];

  newObj.firepower.DPM = calculateDPM(obj.ammo[0].damage[1], obj.gun.fire_rate);
  newObj.firepower.penetration = obj.ammo[0].penetration[1];
  newObj.firepower.damage = obj.ammo[0].damage[1];
  newObj.firepower['rate of fire'] = obj.gun.fire_rate;
  newObj.firepower['reload time'] = obj.gun.reload_time;
  newObj.firepower.caliber = obj.gun.caliber;
  newObj.firepower['ammo capacity'] = obj.max_ammo;
  newObj.firepower['potential damage'] = obj.max_ammo * obj.ammo[0].damage[1];
  newObj.gunHandling['aim time'] = obj.gun.aim_time;
  newObj.gunHandling.dispersion = obj.gun.dispersion;
  newObj.gunHandling.elevation = obj.gun.move_up_arc;
  newObj.gunHandling.depression = obj.gun.move_down_arc;
  newObj.mobility['forward speed'] = obj.speed_forward;
  newObj.mobility['reverse speed'] = obj.speed_backward;
  newObj.mobility['engine power'] = obj.engine.power;
  // WEIGHT
  newObj.mobility.weight = obj.weight;
  newObj.mobility['auto siege on/off'] = obj.siege ? 'On' : 'Off';
  newObj.armorAndHealth['hull armor'] = hullArmor;
  newObj.armorAndHealth['turret armor'] = turretArmor;
  // HP
  newObj.armorAndHealth.health = obj.hp;
  newObj.miscellaneous['view range'] = obj.turret.view_range;
  newObj.miscellaneous['radio range'] = obj.radio.signal_range;
  newObj.miscellaneous['fire chance'] = obj.engine.fire_chance * 100;
  newObj.hull.hull_weight = obj.hull_weight;
  newObj.hull.hull_hp = obj.hull_hp;

  return newObj;
}

export async function createTankObj(obj) {
  const infoObj = await createTankBasicInfoObj(obj);
  let statsObj = await createTankStatsInfoObj(obj.default_profile);

  statsObj.miscellaneous['tank cost'] = obj.price_credit;

  return { ...infoObj, ...statsObj };
}

export function updateURL(url) {
  const newUrl = `${window.location.origin}/?${url}`;
  // console.log(newUrl);
  window.history.replaceState({}, '', newUrl);
}

export function changeProfileId(profile_id_str, curr_module_id, new_module_id) {
  let newProfileId = profile_id_str.split('-');
  const currModuleIdIndex = newProfileId.indexOf(curr_module_id.toString());
  newProfileId.splice(currModuleIdIndex, 1, new_module_id);
  newProfileId = newProfileId.map(id => parseInt(id)).sort((a, b) => a - b);
  const profileIdStr = newProfileId.join('-');
  return { newProfileId, profileIdStr };
}

function getPercentDiff(main, sub) {
  if (!main || !sub || typeof main === 'string' || typeof sub === 'string')
    return null;
  const diff = sub - main;
  let percentageDiff = (diff / main) * 100;

  percentageDiff = Math.round(percentageDiff);
  return percentageDiff;
}

function getCompareResults(diff, pref = 'high') {
  if (diff === null) return null;
  if (pref === 'low') {
    if (diff <= -75) {
      return 'best';
    }
    if (diff <= -50) {
      return 'great';
    }
    if (diff < 0) {
      return 'good';
    }
    if (diff === 0) {
      return null;
    }
    if (diff >= 75) {
      return 'worst';
    }
    if (diff >= 50) {
      return 'bad';
    }
    if (diff > 0) {
      return 'poor';
    }
  } else if (pref === 'high') {
    if (diff <= -75) {
      return 'worst';
    }
    if (diff <= -50) {
      return 'bad';
    }
    if (diff < 0) {
      return 'poor';
    }
    if (diff === 0) {
      return null;
    }
    if (diff >= 75) {
      return 'best';
    }
    if (diff >= 50) {
      return 'great';
    }
    if (diff > 0) {
      return 'good';
    }
  }
}

export function compareValues(mainObj, forComparison) {
  const compareResults = {};
  const fpMain = Object.values(mainObj.firepower);
  const ghMain = Object.values(mainObj.gunHandling);
  const mobMain = Object.values(mainObj.mobility);
  const ahMain = Object.values(mainObj.armorAndHealth);
  const miscMain = Object.values(mainObj.miscellaneous);

  compareResults.firepower = Object.values(forComparison.firepower).map(
    (item, idx) => {
      const diff = getPercentDiff(fpMain[idx], item);
      // console.log(diff);
      if (idx === 4) {
        return getCompareResults(diff, 'low');
      }
      return getCompareResults(diff);
    }
  );

  compareResults.gunHandling = Object.values(forComparison.gunHandling).map(
    (item, idx) => {
      const diff = getPercentDiff(ghMain[idx], item);
      // console.log(diff);
      if (idx === 0 || idx === 1) {
        return getCompareResults(diff, 'low');
      }
      return getCompareResults(diff);
    }
  );

  compareResults.mobility = Object.values(forComparison.mobility).map(
    (item, idx) => {
      const diff = getPercentDiff(mobMain[idx], item);
      // console.log(diff);
      if (idx === 4) {
        return null;
      }
      return getCompareResults(diff);
    }
  );

  const hullArmor = forComparison.armorAndHealth['hull armor'].map(
    (item, idx) => {
      const diff = getPercentDiff(ahMain[0][idx], item);
      // console.log(diff);
      return getCompareResults(diff);
    }
  );

  // needs additional checks if tank has turret
  const turretArmor = forComparison.armorAndHealth['turret armor'].map(
    (item, idx) => {
      const diff = getPercentDiff(ahMain[1][idx], item);
      // console.log(diff);
      return getCompareResults(diff);
    }
  );

  compareResults.armorAndHealth = [
    hullArmor,
    turretArmor,
    getCompareResults(
      getPercentDiff(ahMain[2], forComparison.armorAndHealth.health)
    ),
  ];

  compareResults.miscellaneous = Object.values(forComparison.miscellaneous).map(
    (item, idx) => {
      const diff = getPercentDiff(miscMain[idx], item);
      // console.log(diff);
      if (idx === 2 || idx === 3) {
        return getCompareResults(diff, 'low');
      }
      return getCompareResults(diff);
    }
  );

  return compareResults;
}

// BELOW ARE UNUSED FUNCTIONS
// export function addToURL(tankId, profileId) {
//   const url = new URL(window.location);
//   url.searchParams.append(tankId, profileId);
//   window.history.pushState({}, '', url);
// }
export function deleteFromURL(columnNumber) {
  const url = window.location.href;
  const urlSplit = url.split('?');
  const origin = urlSplit[0];
  const params = urlSplit[1].split('&');
  let inComparisonParams = params.slice(1);
  // what if inComparisonParams returns undefined? doesn't matter, because deleteFromURL fnc is only available if inComparisonParams array items are available

  inComparisonParams = inComparisonParams.filter(
    (_, idx) => idx !== columnNumber
  );

  const newUrl = `${origin}?${params[0]}${
    inComparisonParams.length > 0 ? '&' : ''
  }${inComparisonParams.join('&')}`;

  window.history.replaceState({}, '', newUrl);
}

export function modifyURL(columnNumber, curr_module_id, new_module_id) {
  const url = window.location.href;
  const urlSplit = url.split('?');
  const origin = urlSplit[0];
  const params = urlSplit[1].split('&');
  const toCompareParams = params[0];
  const inComparisonParams = params.slice(1);
  let newToCompareParams, newInComparisonParams, newUrl;

  if (columnNumber === null) {
    const toCompareSplit = toCompareParams.split('=');
    const tankId = toCompareSplit[0];
    const { profileIdStr } = changeProfileId(
      toCompareSplit[1],
      curr_module_id,
      new_module_id
    );
    newToCompareParams = `${tankId}=${profileIdStr}`;

    newUrl = `${origin}?${newToCompareParams}${
      inComparisonParams.length > 0 ? '&' : ''
    }${inComparisonParams.join('&')}`;
  } else {
    newInComparisonParams = inComparisonParams
      .filter((params, idx) => {
        if (columnNumber === idx) {
          const paramsSplit = params.split('=');
          const tankId = paramsSplit[0];
          const { profileIdStr } = changeProfileId(
            paramsSplit[1],
            curr_module_id,
            new_module_id
          );
          const paramsString = `${tankId}=${profileIdStr}`;
          return paramsString;
        } else {
          return params;
        }
      })
      .join('&');

    newUrl = `${origin}?${toCompareParams}${
      inComparisonParams.length > 0 ? '&' : ''
    }${newInComparisonParams}`;
  }

  window.history.replaceState({}, '', newUrl);
}
