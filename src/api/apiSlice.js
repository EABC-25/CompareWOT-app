import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const tankTypeFetch = {
  'Light Tank': 'lightTank',
  'Medium Tank': 'mediumTank',
  'Heavy Tank': 'heavyTank',
  'Tank Destroyer': 'AT-SPG',
  SPG: 'SPG',
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_WG_API_URI,
  }),
  tagTypes: [],
  endpoints: builder => ({
    getTanks: builder.query({
      query: q => {
        let nation = q.nation.toLowerCase();
        const type2 = tankTypeFetch[q.type];
        nation = nation !== 'all' ? `&nation=${nation}` : '';
        const url = `${import.meta.env.VITE_WG_VEHICLES}/?application_id=${
          import.meta.env.VITE_WG_API_KEY_MOBILE
        }&language=en&fields=${import.meta.env.VITE_WG_TANKS_FETCH}&tier=${
          q.tier
        }&type=${type2}${nation}`;
        return url;
      },
      transformResponse: res => {
        const { status, meta, data } = res;
        if (status === 'error') {
          const error = {
            status: 'error',
            code: res.error.code,
          };
          return error;
        }
        const newData = Object.values(data);
        return newData;
      },
    }),
    getTank: builder.query({
      query: tank_id => {
        return `${import.meta.env.VITE_WG_VEHICLES}/?application_id=${
          import.meta.env.VITE_WG_API_KEY_MOBILE
        }&language=en&tank_id=${tank_id}&fields=${
          import.meta.env.VITE_WG_TANK_FETCH
        }`;
      },

      transformResponse: res => {
        const { status, meta, data } = res;
        if (status === 'error') {
          const error = {
            status: 'error',
            code: res.error.code,
          };
          return error;
        }
        const newData = Object.values(data);
        return newData;
      },
    }),
    getModule: builder.query({
      query: arg => {
        let fields;

        if (arg.module_type === 'gun') {
          fields = 'gun%2Cammo%2Cmax_ammo%2C-gun.tag';
        } else if (arg.module_type === 'engine') {
          fields = 'engine%2Cspeed_forward%2Cspeed_backward%2C-engine.tag';
        } else if (arg.module_type === 'turret') {
          fields = 'turret%2Carmor.turret%2C-turret.tag';
        } else if (arg.module_type === 'radio') {
          fields = 'radio%2C-radio.tag';
        } else if (arg.module_type === 'suspension') {
          fields = 'suspension%2C-suspension.tag';
        }

        const URI = `${
          import.meta.env.VITE_WG_VEHICLES_PROFILE
        }/?application_id=${
          import.meta.env.VITE_WG_API_KEY_MOBILE
        }&language=en&tank_id=${arg.tank_id}&${arg.module_type}_id=${
          arg.module_id
        }&fields=${fields}`;

        if (arg !== null || arg !== undefined) {
          return URI;
        }
      },
      transformResponse: res => {
        const { status, meta, data } = res;
        if (status === 'error') {
          const error = {
            status: 'error',
            code: res.error.code,
          };
          return error;
        }

        const newData = Object.values(data);
        return newData[0];
      },
    }),
    getProfile: builder.query({
      query: ({ tank_id, profile_id }) => {
        return `${import.meta.env.VITE_WG_VEHICLES_PROFILE}/?application_id=${
          import.meta.env.VITE_WG_API_KEY_MOBILE
        }&language=en&tank_id=${tank_id}&profile_id=${profile_id}`;
      },
      transformResponse: res => {
        const { status, meta, data } = res;
        if (status === 'error') {
          const error = {
            status: 'error',
            code: res.error.code,
          };
          return error;
        }
        const newData = Object.values(data);
        return newData[0];
      },
    }),
  }),
});

export const {
  useGetTanksQuery,
  useGetTankQuery,
  useGetModuleQuery,
  useGetProfileQuery,
} = apiSlice;
