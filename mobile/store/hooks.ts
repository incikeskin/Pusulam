import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

// typed dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();

// typed selector
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;