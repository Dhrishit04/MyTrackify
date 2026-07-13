import { createContext, useContext } from 'react';

type TransitionCtx = { navigate: (to: string) => void };

export const Ctx = createContext<TransitionCtx>({ navigate: () => {} });

export const useTransitionNavigate = () => useContext(Ctx).navigate;
