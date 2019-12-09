import React from "react";

const RelatorioCard = React.lazy(() =>
  import("./views/Relatorios/RelatorioCard/RelatorioCard")
);

const routes = [
  { path: "/", exact: true, name: "Relatórios" },
  {
    path: "/relatorios",
    exact: true,
    name: "Relatórios",
    component: RelatorioCard
  }
];

export default routes;
