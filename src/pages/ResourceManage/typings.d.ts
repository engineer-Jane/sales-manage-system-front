// @ts-ignore
/* eslint-disable */

declare namespace API {
  type Params = {
    pageNumber: number,
    pageSize: number,
    resourceCode: string,
    resourceName: string
  };

  type TableItem = {
    parentId: number,
    remark: string,
    resourceCode: string,
    resourceId: number,
    resourceName: string,
    resourceStatus: DISPLAY | HIDE,
    resourceType: BUTTON | MENU
  }
}

