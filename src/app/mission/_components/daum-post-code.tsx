import { Button } from "@/components/ui/button";
import { useGetXYToAddress } from "@/hooks/queries/useKakaoMap";
import { useMemo, useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { Map, MapMarker, useKakaoLoader } from "react-kakao-maps-sdk";
import { toast } from "sonner";
import { MissionFormData } from "../_type";
import { Switch } from "@/components/ui/switch";

interface DaumPostCodeButtonProps {
  form: UseFormReturn<MissionFormData>;
}
const GYUNGBUK_LAT_LNG = {
  lat: 36.3974,
  lng: 128.9877,
};
export const DaumPostCodeButton = (props: DaumPostCodeButtonProps) => {
  const { form } = props;
  const [isOpenKakaoMap, setIsOpenKakaoMap] = useState(false);
  const [tempGyungbuk, setTempGyungbuk] = useState(false); // 경북 외 임시 저장

  const [currentState, setCurrentState] = useState<{
    center: { lat: number; lng: number };
    errMessage: string | null;
    isLoading: boolean;
  }>({
    center: {
      lat: 33.450701,
      lng: 126.570667,
    },
    errMessage: null,
    isLoading: true,
  });

  const [loading, error] = useKakaoLoader({
    appkey: process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY || "",
  });

  const { data: address } = useGetXYToAddress(
    {
      x: currentState.center.lng,
      y: currentState.center.lat,
    },
    {
      enabled: !!currentState.center.lng && !!currentState.center.lat,
    }
  );

  const isNotGyungbuk = useMemo(() => {
    return (
      address?.region_1depth_name !== "경북" &&
      address?.region_1depth_name !== "경상북도"
    );
  }, [address]);

  // form setValue는 useEffect로 처리하여 렌더링 중 상태 업데이트 방지
  useEffect(() => {
    if (address && !isNotGyungbuk) {
      form.setValue("latitude", currentState.center.lat);
      form.setValue("longitude", currentState.center.lng);
    } else if (tempGyungbuk) {
      form.setValue("latitude", GYUNGBUK_LAT_LNG.lat);
      form.setValue("longitude", GYUNGBUK_LAT_LNG.lng);
    } else {
      form.unregister("latitude");
      form.unregister("longitude");
    }
  }, [address, currentState.center, form, isNotGyungbuk, tempGyungbuk]);

  const handleClick = () => {
    if (loading) return;
    if (error) {
      toast("Kakao Map 로드에 실패했습니다.");
    }

    setIsOpenKakaoMap(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude; // 위도
          const lon = position.coords.longitude; // 경도
          setCurrentState((prev) => ({
            ...prev,
            center: {
              lat,
              lng: lon,
            },
            isLoading: false,
          }));
        },
        (error) => {
          toast(`위치 정보를 가져오는데 실패했습니다. ${error.message}}`);
        }
      );
    } else {
      setCurrentState((prev) => ({
        ...prev,
        errMsg: "이 브라우저에서는 Geolocation이 지원되지 않습니다.",
        isLoading: false,
      }));
      toast("이 브라우저에서는 Geolocation이 지원되지 않습니다.");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Button type="button" variant={"outline"} onClick={handleClick}>
        현재 주소 가져오기
      </Button>
      {loading && <div className="text-sm text-gray-500">로딩 중...</div>}
      {error && (
        <div className="text-sm text-red-500">에러 발생: {error.message}</div>
      )}
      {!loading && isOpenKakaoMap && currentState && (
        <Map
          center={{
            lat: currentState.center.lat,
            lng: currentState.center.lng,
          }}
          style={{ width: "100%", height: "200px" }}
        >
          <MapMarker
            position={{
              lat: currentState.center.lat,
              lng: currentState.center.lng,
            }}
            title="현재 위치"
          >
            <div className="text-xs text-center p-1">
              {address?.address_name}
            </div>
          </MapMarker>
        </Map>
      )}
      {form.formState.errors &&
        (form.formState.errors.latitude || form.formState.errors.longitude) && (
          <div className="text-sm text-red-500">
            주소가 설정되지 않았습니다, 현재 주소 가져오기 버튼을 눌러 주소를
            가져와 주세요.
          </div>
        )}
      {!currentState.isLoading && isNotGyungbuk && (
        <div className="text-sm text-red-500">
          경북 내에 위치하지 않습니다. 인증은 경북 내에서만 가능합니다.
        </div>
      )}
      <div className="flex items-center gap-2">
        <Switch
          onClick={() => setTempGyungbuk((prev) => !prev)}
          checked={tempGyungbuk}
        />
        <span className="text-sm text-gray-500">
          테스트용: 임시 경북 지역으로 설정하기
        </span>
      </div>
    </div>
  );
};
