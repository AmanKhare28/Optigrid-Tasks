import { Checkbox, FormControlLabel, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const Task = ({ id, title, onDelete, onComplete }) => {
  return (
    <div className="flex items-center w-full justify-between hover:bg-blue-100 rounded-xl px-6 py-3 cursor-crosshair">
      <div className="flex items-center">
        <FormControlLabel
          control={
            <Checkbox
              size="medium"
              color="primary"
              onChange={() => onComplete(id)}
            />
          }
          label={title}
        />
      </div>
      <Tooltip title="Delete Task">
        <DeleteIcon
          sx={{ cursor: "pointer" }}
          color="primary"
          onClick={() => onDelete(id)}
        />
      </Tooltip>
    </div>
  );
};

export default Task;
