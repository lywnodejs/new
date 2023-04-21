import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import { GridRenderCellParams } from '@mui/x-data-grid-pro';

export function renderAvatar(params: GridRenderCellParams) {
  return (
    <Avatar style={{ backgroundColor: params.value as any }}>
      {params.row.name!.toString().toUpperCase().substring(0, 1)}
    </Avatar>
  );
}
