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
import { Income } from "../types";

interface IncomeProps {
  incomes: Income[];
  onUpdate: (incomes: Income[]) => void;
}

export default function Incomes({ incomes, onUpdate }: IncomeProps) {
  const [open, setOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const [formData, setFormData] = useState<Partial<Income>>({});

  const handleOpen = (income?: Income) => {
    setEditingIncome(income || null);
    setFormData(income || { isRecurring: true });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingIncome(null);
    setFormData({});
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.amount || !formData.paymentDate) return;

    const newIncome: Income = {
      id: editingIncome?.id || Date.now().toString(),
      name: formData.name,
      amount: Number(formData.amount),
      paymentDate: Number(formData.paymentDate),
      isRecurring: formData.isRecurring || false,
    };

    const newIncomes = editingIncome
      ? incomes.map((income) =>
          income.id === editingIncome.id ? newIncome : income,
        )
      : [...incomes, newIncome];

    onUpdate(newIncomes);
    handleClose();
  };

  const handleDelete = (id: string) => {
    onUpdate(incomes.filter((income) => income.id !== id));
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          収入
        </Typography>
        <List>
          {incomes.map((income) => (
            <ListItem
              key={income.id}
              secondaryAction={
                <>
                  <IconButton onClick={() => handleOpen(income)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(income.id)}>
                    <DeleteIcon />
                  </IconButton>
                </>
              }
            >
              <ListItemText
                primary={income.name}
                secondary={`金額: ¥${income.amount.toLocaleString()} | 支払日: ${
                  income.paymentDate
                }日 | ${income.isRecurring ? "定期収入" : "単発収入"}`}
              />
            </ListItem>
          ))}
        </List>
        <Button variant="contained" onClick={() => handleOpen()} sx={{ mt: 2 }}>
          収入を追加
        </Button>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>
            {editingIncome ? "収入を編集" : "収入を追加"}
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
              label="金額"
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
              value={formData.paymentDate || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  paymentDate: Number(e.target.value),
                })
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
              label="定期収入"
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
