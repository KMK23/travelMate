import React, { useState, useEffect } from "react";
import { Card, Form, Button, ListGroup } from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const TravelPlanner = () => {
  const [plans, setPlans] = useState([]);
  const [newPlan, setNewPlan] = useState({
    title: "",
    date: "",
    location: "",
    memo: "",
  });
  const [editingId, setEditingId] = useState(null);

  // 로컬 스토리지에서 일정 불러오기
  useEffect(() => {
    const savedPlans = localStorage.getItem("travelPlans");
    if (savedPlans) {
      setPlans(JSON.parse(savedPlans));
    }
  }, []);

  // 일정 저장
  useEffect(() => {
    localStorage.setItem("travelPlans", JSON.stringify(plans));
  }, [plans]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId !== null) {
      // 일정 수정
      setPlans(
        plans.map((plan) =>
          plan.id === editingId ? { ...newPlan, id: editingId } : plan
        )
      );
      setEditingId(null);
    } else {
      // 새 일정 추가
      setPlans([...plans, { ...newPlan, id: Date.now() }]);
    }
    setNewPlan({ title: "", date: "", location: "", memo: "" });
  };

  const handleEdit = (plan) => {
    setNewPlan(plan);
    setEditingId(plan.id);
  };

  const handleDelete = (id) => {
    setPlans(plans.filter((plan) => plan.id !== id));
  };

  return (
    <Card className="travel-planner">
      <Card.Header className="bg-primary text-white">
        <h3 className="mb-0">여행 일정 관리</h3>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>제목</Form.Label>
            <Form.Control
              type="text"
              value={newPlan.title}
              onChange={(e) =>
                setNewPlan({ ...newPlan, title: e.target.value })
              }
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>날짜</Form.Label>
            <Form.Control
              type="date"
              value={newPlan.date}
              onChange={(e) => setNewPlan({ ...newPlan, date: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>장소</Form.Label>
            <Form.Control
              type="text"
              value={newPlan.location}
              onChange={(e) =>
                setNewPlan({ ...newPlan, location: e.target.value })
              }
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>메모</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={newPlan.memo}
              onChange={(e) => setNewPlan({ ...newPlan, memo: e.target.value })}
            />
          </Form.Group>
          <Button type="submit" variant="primary" className="w-100">
            {editingId !== null ? "일정 수정" : "일정 추가"} <FaPlus />
          </Button>
        </Form>

        <ListGroup className="mt-4">
          {plans.map((plan) => (
            <ListGroup.Item
              key={plan.id}
              className="d-flex justify-content-between align-items-center"
            >
              <div>
                <h5>{plan.title}</h5>
                <p className="mb-1">📅 {plan.date}</p>
                <p className="mb-1">📍 {plan.location}</p>
                {plan.memo && <p className="mb-0 text-muted">📝 {plan.memo}</p>}
              </div>
              <div>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEdit(plan)}
                >
                  <FaEdit />
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDelete(plan.id)}
                >
                  <FaTrash />
                </Button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

export default TravelPlanner;
