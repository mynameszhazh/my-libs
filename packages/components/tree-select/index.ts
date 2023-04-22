import TreeSelect from "./src/tree-select.vue";

TreeSelect.install = (app): void => {
  app.component(TreeSelect.name, TreeSelect);
};

const _TreeSelect: any = TreeSelect;

export default _TreeSelect;
export const ElTreeSelect = _TreeSelect;
