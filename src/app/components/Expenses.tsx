import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Expense } from "../types";

interface ExpensesProps {
  expenses: Expense[];
  onUpdate: (expenses: Expense[]) => void;
}

export default function Expenses({ expenses, onUpdate }: ExpensesProps) {
  const [open, setOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [formData, setFormData] = useState<Partial<Expense>>({});

  const handleOpen = (expense?: Expense) => {
    setEditingExpense(expense || null);
    setFormData(expense || { isRecurring: false });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingExpense(null);
    setFormData({});
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.amount || !formData.dueDate) return;

    const newExpense: Expense = {
      id: editingExpense?.id || Date.now().toString(),
      name: formData.name,
      amount: Number(formData.amount),
      dueDate: Number(formData.dueDate),
      isRecurring: formData.isRecurring || false,
    };

    const newExpenses = editingExpense
      ? expenses.map((expense) =>
          expense.id === editingExpense.id ? newExpense : expense,
        )
      : [...expenses, newExpense];

    onUpdate(newExpenses);
    handleClose();
  };

  const handleDelete = (id: string) => {
    onUpdate(expenses.filter((expense) => expense.id !== id));
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          固定支出
        </Typography>
        <List>
          {expenses.map((expense) => (
            <ListItem
              key={expense.id}
              secondaryAction={
                <>
                  <IconButton onClick={() => handleOpen(expense)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(expense.id)}>
                    <DeleteIcon />
                  </IconButton>
                </>
              }
            >
              <ListItemText
                primary={expense.name}
                secondary={`支払額: ¥${expense.amount.toLocaleString()} | 支払日: ${
                  expense.dueDate
                }日 | ${expense.isRecurring ? "定期支払" : "単発支払"}`}
              />
            </ListItem>
          ))}
        </List>
        <Button variant="contained" onClick={() => handleOpen()} sx={{ mt: 2 }}>
          支出を追加
        </Button>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>
            {editingExpense ? "支出を編集" : "支出を追加"}
          </DialogTitle>
          <DialogContent>
            <TextField
              label="名称"
              value={formData.name || ""}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="支払額"
              type="number"
              value={formData.amount || ""}
              onChange={(e) =>
                setFormData({ ...formData, amount: Number(e.target.value) })
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="支払日"
              type="number"
              value={formData.dueDate || ""}
              onChange={(e) =>
                setFormData({ ...formData, dueDate: Number(e.target.value) })
              }
              fullWidth
              margin="normal"
              inputProps={{ min: 1, max: 31 }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isRecurring || false}
                  onChange={(e) =>
                    setFormData({ ...formData, isRecurring: e.target.checked })
                  }
                />
              }
              label="定期支払"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>キャンセル</Button>
            <Button onClick={handleSubmit} variant="contained">
              保存
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
}
