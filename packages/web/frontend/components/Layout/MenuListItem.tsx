import { ListItemButton, ListItemIcon, ListItemText, Tooltip } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

interface MenuListItemProps {
  title: string;
  path: string;
  icon: React.ReactNode;
  open: boolean;
}

export default function MenuListItem(props: MenuListItemProps) {
  const navigate = useNavigate();

  return (
    <Tooltip title={props.title} placement="right">
      <ListItemButton
        sx={{
          minHeight: 48,
          justifyContent: props.open ? "initial" : "center",
          px: 2.5,
        }}
        onClick={() => navigate(props.path)}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: props.open ? 3 : "auto",
            justifyContent: "center",
          }}
        >
          {props.icon}
        </ListItemIcon>
        <ListItemText primary={props.title} sx={{ opacity: props.open ? 1 : 0 }} />
      </ListItemButton>
    </Tooltip>
  );
}
