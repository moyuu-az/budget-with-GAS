import {
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

interface BalanceProps {
  currentBalance: number;
  onUpdateBalance: (amount: number) => void;
}

export default function Balance({
  currentBalance,
  onUpdateBalance,
}: BalanceProps) {
  const [editMode, setEditMode] = useState(false);
  const [newBalance, setNewBalance] = useState(currentBalance);

  const handleSubmit = () => {
    onUpdateBalance(newBalance);
    setEditMode(false);
  };

  return (
    <Card sx={{ minWidth: 275, mb: 2 }}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          現在の残高
        </Typography>
        {editMode ? (
          <div>
            <TextField
              type="number"
              value={newBalance}
              onChange={(e) => setNewBalance(Number(e.target.value))}
              fullWidth
              sx={{ mb: 2 }}
            />
            <Button variant="contained" onClick={handleSubmit} sx={{ mr: 1 }}>
              保存
            </Button>
            <Button variant="outlined" onClick={() => setEditMode(false)}>
              キャンセル
            </Button>
          </div>
        ) : (
          <div>
            <Typography variant="h4" component="div" color="primary">
              ¥{currentBalance.toLocaleString()}
            </Typography>
            <Button
              variant="outlined"
              onClick={() => setEditMode(true)}
              sx={{ mt: 2 }}
            >
              編集
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
