import React, { useEffect } from "react";
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { fetchPlans, deleteExistingPlan } from "../store/slices/travelSlice";
import { toast } from "react-toastify";

const TravelPlanList = ({ onEdit }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth?.user);
  const travel = useSelector((state) => state.travel);
  const plans = travel?.plans || [];
  const loading = travel?.loading || false;
  const error = travel?.error || null;
  console.log(travel);

  useEffect(() => {
    const fetchData = async () => {
      if (user?.uid) {
        console.log("Fetching plans for user:", user.uid);
        try {
          await dispatch(fetchPlans(user.uid)).unwrap();
        } catch (error) {
          console.error("Error fetching plans:", error);
        }
      }
    };
    fetchData();
  }, [user, dispatch]);

  const handleDelete = async (planId) => {
    if (!user?.uid) return;
    try {
      await dispatch(deleteExistingPlan({ userId: user.uid, planId })).unwrap();
      toast.success("여행 일정이 삭제되었습니다.");
    } catch (error) {
      console.error("여행 계획 삭제 중 오류:", error);
      toast.error("여행 일정 삭제에 실패했습니다.");
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <Typography>로딩 중...</Typography>
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">에러: {error}</Typography>;
  }

  console.log("Current user:", user);
  console.log("Current travel state:", travel);
  console.log("Rendering plans:", plans);

  return (
    <Paper elevation={3} sx={{ p: 3, height: "100%", overflow: "auto" }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        내 여행 일정 목록
      </Typography>
      <List>
        {!plans || plans.length === 0 ? (
          <Typography color="textSecondary" align="center">
            등록된 여행 일정이 없습니다.
          </Typography>
        ) : (
          plans.map((plan) => (
            <Paper key={plan.id} sx={{ mb: 2, p: 2 }}>
              <ListItem
                disableGutters
                secondaryAction={
                  <Box>
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={() => onEdit && onEdit(plan)}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDelete(plan.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }
              >
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6">{plan.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    📅 {plan.date}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    📍 {plan.location}
                  </Typography>
                  {plan.description && (
                    <Typography variant="body2" color="text.secondary">
                      📝 {plan.description}
                    </Typography>
                  )}
                </Box>
              </ListItem>
            </Paper>
          ))
        )}
      </List>
    </Paper>
  );
};

export default TravelPlanList;
