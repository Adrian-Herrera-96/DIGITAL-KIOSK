import { configureStore } from "@reduxjs/toolkit";
import {
  authSlice,
  chooserSlice,
  loanSlice,
  personSlice,
  statisticsSlice,
} from ".";
import { contributionSlice } from "./contribution/contributionSlice";
import { fingerprintSlice } from "./biometric/fingerprintSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    loans: loanSlice.reducer,
    statistics: statisticsSlice.reducer,
    contributions: contributionSlice.reducer,
    fingerprints: fingerprintSlice.reducer,
    chooser: chooserSlice.reducer,
    person: personSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
