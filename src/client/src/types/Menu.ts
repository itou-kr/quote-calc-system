export type Menu = {
    items: MenuItem[];
};

export type MenuItem = {
    viewId: string;
    viewName: string;
    parentViewId?: string;
    actionPath?: string;
    enabled: boolean;
};