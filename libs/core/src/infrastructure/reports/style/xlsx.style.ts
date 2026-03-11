export const HeaderMainStyle = (workbook: any) => {
  return workbook.createStyle({
    alignment: {
      vertical: 'center',
      horizontal: 'center',
    },
    font: {
      color: '#000000',
      size: 16,
    },
    border: {
      left: {
        style: 'thin',
        color: '#000000',
      },
      right: {
        style: 'thin',
        color: '#000000',
      },
      top: {
        style: 'thin',
        color: '#000000',
      },
      bottom: {
        style: 'thin',
        color: '#000000',
      },
    },
  });
};

export const DataHeaderStyle = (workbook: any) => {
  return workbook.createStyle({
    alignment: {
      vertical: 'center',
      horizontal: 'left',
    },
    font: {
      color: '#000000',
      size: 14,
      bold: true,
    },
    border: {
      left: {
        style: 'thick',
        color: '#000000',
      },
      right: {
        style: 'thick',
        color: '#000000',
      },
      top: {
        style: 'thick',
        color: '#000000',
      },
      bottom: {
        style: 'thick',
        color: '#000000',
      },
    },
  });
};
