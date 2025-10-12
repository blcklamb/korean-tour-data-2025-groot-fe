import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMissionCompletion } from "@/hooks/queries";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { DaumPostCodeButton } from "./daum-post-code";
import { MissionFormData, missionSchema } from "../_type";
import { toast } from "sonner";
import { tokenStorage } from "@/lib/api";
import Link from "next/link";

interface MissionSubmitDialogProps {
  missionId: number;
}
export const MissionSubmitDialog = (props: MissionSubmitDialogProps) => {
  const { missionId } = props;

  const isAuthorized = tokenStorage.isAuthenticated(); // TODO: 권한 체크 로직 추가

  const completionMutation = useMissionCompletion({
    onSuccess: (result) => {
      console.log(result);
      toast.success("미션 인증을 성공했습니다!");
    },
  });

  const form = useForm<MissionFormData>({
    resolver: zodResolver(missionSchema),
    mode: "onChange",
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "images" && e.target.files) {
      const filesArray = Array.from(e.target.files);
      form.setValue("files", filesArray);
    }
  };

  const handleSubmit = (data: MissionFormData) => {
    if (!isAuthorized) {
      toast.error("미션 인증을 위해 로그인해주세요.");
      return;
    }
    completionMutation.mutate(
      {
        missionId,
        formData: {
          content: data.content,
          latitude: data.latitude!,
          longitude: data.longitude!,
          images: data.files || [],
        },
      },
      {}
    );
    form.reset();
  };

  console.log("isAuthorized", isAuthorized);

  return (
    <Dialog>
      {isAuthorized ? (
        <DialogTrigger asChild>
          <Button
            variant="secondary"
            className="w-full flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            미션 인증하기
          </Button>
        </DialogTrigger>
      ) : (
        <Button
          variant="secondary"
          className="w-full flex items-center gap-2"
          onClick={() => {
            if (!isAuthorized) {
              toast.error("미션 인증을 위해 로그인해주세요.");
              return;
            }
          }}
        >
          <Upload className="h-4 w-4" />
          미션 인증하기
        </Button>
      )}
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>미션 제출</DialogTitle>
          <DialogDescription>
            미션을 제출하시겠습니까? 제출 후에는 수정할 수 없습니다.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-gray-700"
                htmlFor="content"
              >
                활동 내용
              </label>
              <Textarea
                id="content"
                placeholder="오늘 실천한 친환경 활동을 기록해보세요."
                minLength={5}
                rows={4}
                required
                {...form.register("content")}
              />
            </div>

            <div>
              <label
                className="text-sm font-medium text-gray-700"
                htmlFor="content"
              >
                인증 주소
              </label>
              <DaumPostCodeButton form={form} />
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-gray-700"
                htmlFor="images"
              >
                인증 사진 업로드 (최대 3장)
              </label>
              <Input
                id="images"
                name="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFormChange}
              />
              {(form.getValues("files") || []).length > 0 && (
                <p className="text-xs text-muted-foreground">
                  {(form.getValues("files") || []).length}개의 사진이
                  선택되었습니다.
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <Button
                type="submit"
                disabled={completionMutation.isPending}
                className="flex items-center gap-2"
              >
                {completionMutation.isPending && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                미션 인증 올리기
              </Button>
              <Link
                href="/missions"
                className="text-sm text-emerald-700 hover:underline"
              >
                다른 사용자 인증 보러 가기 →
              </Link>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
