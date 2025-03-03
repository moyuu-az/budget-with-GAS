import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { CreditCard } from "../types";

interface CreditCardsProps {
  creditCards: CreditCard[];
  onUpdate: (creditCards: CreditCard[]) => void;
}

export default function CreditCards({
  creditCards,
  onUpdate,
}: CreditCardsProps) {
  const [open, setOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CreditCard | null>(null);
  const [formData, setFormData] = useState<Partial<CreditCard>>({});

  const handleOpen = (card?: CreditCard) => {
    setEditingCard(card || null);
    setFormData(card || {});
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingCard(null);
    setFormData({});
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.limit || !formData.paymentDate) return;

    const newCard: CreditCard = {
      id: editingCard?.id || Date.now().toString(),
      name: formData.name,
      limit: Number(formData.limit),
      paymentDate: Number(formData.paymentDate),
      currentBalance: Number(formData.currentBalance || 0),
    };

    const newCards = editingCard
      ? creditCards.map((card) => (card.id === editingCard.id ? newCard : card))
      : [...creditCards, newCard];

    onUpdate(newCards);
    handleClose();
  };

  const handleDelete = (id: string | undefined) => {
    if (!id) return;
    onUpdate(creditCards.filter((card) => card.id !== id));
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          クレジットカード
        </Typography>
        <List>
          {creditCards.map((card) => (
            <ListItem
              key={card.id}
              secondaryAction={
                <>
                  <IconButton onClick={() => handleOpen(card)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(card.id)}>
                    <DeleteIcon />
                  </IconButton>
                </>
              }
            >
              <ListItemText
                primary={card.name}
                secondary={`利用限度額: ¥${card.limit.toLocaleString()} | 支払日: ${card.paymentDate}日 | 現在の利用額: ¥${card.currentBalance.toLocaleString()}`}
              />
            </ListItem>
          ))}
        </List>
        <Button variant="contained" onClick={() => handleOpen()} sx={{ mt: 2 }}>
          カードを追加
        </Button>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>
            {editingCard ? "クレジットカードを編集" : "クレジットカードを追加"}
          </DialogTitle>
          <DialogContent>
            <TextField
              label="カード名"
              value={formData.name || ""}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="利用限度額"
              type="number"
              value={formData.limit || ""}
              onChange={(e) =>
                setFormData({ ...formData, limit: Number(e.target.value) })
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
            <TextField
              label="現在の利用額"
              type="number"
              value={formData.currentBalance || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  currentBalance: Number(e.target.value),
                })
              }
              fullWidth
              margin="normal"
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
