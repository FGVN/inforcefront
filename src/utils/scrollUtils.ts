export const isBottomOfPage = (): boolean => {
    return (
      window.innerHeight + document.documentElement.scrollTop + 50 >=
      document.documentElement.scrollHeight
    );
  };
  