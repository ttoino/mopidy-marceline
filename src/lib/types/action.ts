import type { MaterialSymbol } from "material-symbols";

export type Action = {
    action: () => void;
    icon: MaterialSymbol;
    label: string;
};

export type ActionGroup = {
    actions: Action[];
    icon: MaterialSymbol;
    label: string;
};

export type Actions = (Action | ActionGroup)[];
