import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./store";

// Dispatch tipi
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Selector tipi
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
