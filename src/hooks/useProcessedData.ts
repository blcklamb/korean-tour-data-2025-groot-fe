import { useMemo } from "react";
import { useLocations, useEcoTourCourses } from "./queries";
import { useGetTransportationTypes } from "./queries/useCalculator";

// 처리된 위치 옵션을 제공하는 훅
export const useLocationOptions = () => {
  const {
    data: locationData,
    isError: isLocationError,
    isLoading,
  } = useLocations();

  return useMemo(
    () => ({
      options: isLocationError
        ? []
        : (locationData || []).map((location) => ({
            value: String(location.id),
            label: location.areaName,
          })),
      isError: isLocationError,
      isLoading,
    }),
    [locationData, isLocationError, isLoading]
  );
};

// 처리된 에코투어 코스 옵션을 제공하는 훅
export const useEcoTourOptions = (
  params?: Parameters<typeof useEcoTourCourses>[0]
) => {
  const {
    data: ecoTourCourseData,
    isError: isEcoTourError,
    isLoading,
  } = useEcoTourCourses(params);

  return useMemo(
    () => ({
      options: isEcoTourError
        ? []
        : (ecoTourCourseData?.courses || []).map((course) => ({
            ...course,
            value: String(course.id),
            label: course.title,
          })),
      isError: isEcoTourError,
      isLoading,
    }),
    [ecoTourCourseData, isEcoTourError, isLoading]
  );
};

// 처리된 교통수단 옵션을 제공하는 훅
export const useTransportOptions = () => {
  const {
    data: transportTypeData,
    isError: isTransportError,
    isLoading,
  } = useGetTransportationTypes();

  return useMemo(
    () => ({
      options: isTransportError
        ? []
        : (transportTypeData || []).map((type) => ({
            id: type.id,
            value: String(type.id),
            label: type.name,
            icon: type.icon,
          })),
      isError: isTransportError,
      isLoading,
    }),
    [transportTypeData, isTransportError, isLoading]
  );
};

// 모든 데이터를 종합해서 제공하는 훅
export const useCombinedOptions = (
  ecoTourParams?: Parameters<typeof useEcoTourCourses>[0]
) => {
  const locationOptions = useLocationOptions();
  const ecoTourOptions = useEcoTourOptions(ecoTourParams);
  const transportOptions = useTransportOptions();

  const isLoading =
    locationOptions.isLoading ||
    ecoTourOptions.isLoading ||
    transportOptions.isLoading;
  const hasError =
    locationOptions.isError ||
    ecoTourOptions.isError ||
    transportOptions.isError;

  return {
    locationOptions: locationOptions.options,
    ecoTourOptions: ecoTourOptions.options,
    transportOptions: transportOptions.options,
    isLoading,
    hasError,
    errors: {
      location: locationOptions.isError,
      ecoTour: ecoTourOptions.isError,
      transport: transportOptions.isError,
    },
  };
};
