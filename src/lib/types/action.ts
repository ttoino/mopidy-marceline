import type { MaterialSymbol } from "material-symbols";

export type Action = ActionGroup | BaseAction | Divider;

export type ActionGroup = {
    actions: BaseAction[];
    icon: MaterialSymbol;
    label: string;
};

export type Actions = Action[];

export type BaseAction = {
    action: () => void;
    icon: MaterialSymbol;
    label: string;
};

export type Divider = "divider";
