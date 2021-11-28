const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};

const renderTemplate = (container, template, position) => {
  container.insertAdjacentHTML(position, template);
};

export {RenderPosition, renderTemplate};

