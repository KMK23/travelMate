import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";
import { Add as AddIcon, Edit as EditIcon } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { addNewPlan, updateExistingPlan } from "../store/slices/travelSlice";
import { toast } from "react-toastify";

const TravelPlanForm = ({ editingPlan, onEditComplete }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth?.user);

  const [plan, setPlan] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
  });

  useEffect(() => {
    if (editingPlan) {
      setPlan(editingPlan);
    }
  }, [editingPlan]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPlan) {
        await dispatch(
          updateExistingPlan({
            userId: user.uid,
            planId: editingPlan.id,
            planData: plan,
          })
        ).unwrap();
        toast.success("여행 일정이 수정되었습니다.");
        onEditComplete && onEditComplete();
      } else {
        await dispatch(
          addNewPlan({ userId: user.uid, planData: plan })
        ).unwrap();
        toast.success("새로운 여행 일정이 등록되었습니다.");
      }
      setPlan({ title: "", date: "", location: "", description: "" });
    } catch (error) {
      console.error("여행 계획 처리 중 오류:", error);
      toast.error(
        editingPlan
          ? "여행 일정 수정에 실패했습니다."
          : "여행 일정 등록에 실패했습니다."
      );
    }
  };

  const handleCancel = () => {
    setPlan({ title: "", date: "", location: "", description: "" });
    onEditComplete && onEditComplete();
  };

  return (
    <>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        여행 일정 {editingPlan ? "수정" : "등록"}
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="제목"
          value={plan.title}
          onChange={(e) => setPlan({ ...plan, title: e.target.value })}
          required
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="날짜"
          type="date"
          value={plan.date}
          onChange={(e) => setPlan({ ...plan, date: e.target.value })}
          required
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="장소"
          value={plan.location}
          onChange={(e) => setPlan({ ...plan, location: e.target.value })}
          required
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="설명"
          multiline
          rows={3}
          value={plan.description}
          onChange={(e) => setPlan({ ...plan, description: e.target.value })}
          sx={{ mb: 3 }}
        />
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            startIcon={editingPlan ? <EditIcon /> : <AddIcon />}
          >
            {editingPlan ? "수정하기" : "등록하기"}
          </Button>
          {editingPlan && (
            <Button variant="outlined" fullWidth onClick={handleCancel}>
              취소
            </Button>
          )}
        </Box>
      </Box>
    </>
  );
};

export default TravelPlanForm;
