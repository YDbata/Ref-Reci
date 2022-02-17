import { useMediaQuery } from "@material-ui/core";

export const useNowCols = () => {
  const isXl = useMediaQuery((theme) => theme.breakpoints.up("xl"));
  const isLg = useMediaQuery((theme) => theme.breakpoints.down("lg"));
  const isMd = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const isSm = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const isXs = useMediaQuery((theme) => theme.breakpoints.down("xs"));
  return (isXs && 2) || (isSm && 3) || (isMd && 4) || (isLg && 5) || (isXl && 6);
};
