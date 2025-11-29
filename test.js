// Simple Todo app (paste into a <script> tag)
class TodoApp {
  constructor(root = document.body) {
    this.root = root;
    this.items = [];
    this.buildUI();
    this.bindEvents();
    this.fetchInitial();
  }

  buildUI() {
    this.container = document.createElement('div');
    this.container.style.maxWidth = '480px';
    this.container.style.margin = '20px auto';
    this.container.innerHTML = `
      <h3>Todo</h3>
      <div style="display:flex;gap:8px;margin-bottom:8px;">
        <input id="todo-input" placeholder="Add a todo" style="flex:1;padding:6px"/>
        <button id="todo-add">Add</button>
      </div>
      <ul id="todo-list" style="padding-left:20px;"></ul>
    `;
    this.root.appendChild(this.container);

    this.input = this.container.querySelector('#todo-input');
    this.addBtn = this.container.querySelector('#todo-add');
    this.listEl = this.container.querySelector('#todo-list');
  }

  bindEvents() {
    this.addBtn.addEventListener('click', () => this.addItem(this.input.value));
    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.addItem(this.input.value);
    });
  }

  async fetchInitial() {
    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5');
      const data = await res.json();
      this.items = data.map(t => ({ id: t.id, title: t.title }));
      this.render();
    } catch (err) {
      console.warn('Fetch failed, starting empty', err);
      this.items = [];
      this.render();
    }
  }

  addItem(text) {
    const trimmed = (text || '').trim();
    if (!trimmed) return;
    this.items.unshift({ id: Date.now(), title: trimmed });
    this.input.value = '';
    this.render();
  }

  removeItem(id) {
    this.items = this.items.filter(i => i.id !== id);
    this.render();
  }

  render() {
    this.listEl.innerHTML = '';
    for (const item of this.items) {
      const li = document.createElement('li');
      li.style.display = 'flex';
      li.style.justifyContent = 'space-between';
      li.style.alignItems = 'center';
      li.style.marginBottom = '6px';

      const span = document.createElement('span');
      span.textContent = item.title;

      const btn = document.createElement('button');
      btn.textContent = 'Remove';
      btn.addEventListener('click', () => this.removeItem(item.id));

      li.appendChild(span);
      li.appendChild(btn);
      this.listEl.appendChild(li);
    }
  }
}

// Start the app
new TodoApp();