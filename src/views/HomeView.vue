<template>
  <div class="home">
    当前路由下的数据为{{ filteredTodos }}
    <br />
    当前未选中的数据个数为{{ remaining }}个
    <br />
    当前id为{{ focusTodo_id }}的input获取焦点
    <br />
    保存的之前的数据为{{ beforeTodo }}
    <br />
    当前路由{{ visibility }}
    <div class="box">
      <div class="input">
        <input
          type="text"
          autofocus
          placeholder="需要做什么？"
          autocomplete="off"
          v-model="newTodo"
          @keydown.enter="addTodo"
        />
        <input type="checkbox" v-model="allDone" />
      </div>
      <div class="list">
        <ul class="todo-list">
          <li
            v-for="todo in filteredTodos"
            :key="todo.id"
            :class="{
              completed: todo.completed,
              focusTodo: focusTodo_id === todo.id,
            }"
          >
            <div class="view">
              <input type="checkbox" class="toggle" v-model="todo.completed" />
              <label @dblclick="editTodo(todo)">{{ todo.title }}</label>
              <span class="destroy" @click="removeTodo(todo.id)">X</span>
            </div>
            <input
              type="text"
              class="edit"
              v-model="todo.title"
              v-focus="focusTodo_id === todo.id"
              @keydown.esc="escTodo(todo)"
              @blur="blurTodo(todo)"
              @keydown.enter="blurTodo(todo)"
            />
          </li>
        </ul>
      </div>
      <div class="footer">
        <span>{{ remaining }} items left</span>
        <ul>
          <li>
            <router-link to="all">all</router-link>
          </li>
          <li>
            <router-link to="active">active</router-link>
          </li>
          <li>
            <router-link to="completed">completed</router-link>
          </li>
        </ul>
        <span v-show="todos.length !== remaining" @click="clearTodos">clear completed</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data: function () {
    return {
      newTodo: "",
      focusTodo_id: null,
      todos: [
        {
          id: 1,
          title: "apple",
          completed: false,
        },
        {
          id: 2,
          title: "tomato",
          completed: false,
        },
        {
          id: 3,
          title: "banana",
          completed: false,
        },
      ],
      beforeTodo: "",
      visibility: "all",
    };
  },
  computed: {
    //remaining表示未选中的数据的个数
    remaining: function () {
      return this.todos.filter((item) => !item.completed).length;
    },
    //allDone表示全选状态，当未选中数据个数remaining改变造成addDone改变的时候，执行get方法，当未选中个数为0，则allDone为true，反之为false
    //当修改计算属性allDone时，执行set方法，set方法传入参数为allDone的变化值，将所有数据的选中状态等于allDone的变化值
    allDone: {
      get: function () {
        return this.remaining === 0;
      },
      set: function (value) {
        this.filteredTodos.forEach((todo) => (todo.completed = value));
      },
    },
    //filterTodos表示对todos总数据进行过滤之后的数据
    filteredTodos: function () {
      if (this.visibility === "completed") {
        return this.todos.filter((item) => item.completed);
      } else if (this.visibility === "active") {
        return this.todos.filter((item) => !item.completed);
      } else {
        return this.todos;
      }
    },
  },
  methods: {
    //添加数据
    addTodo() {
      //判断是否为空字符串，是则中断执行，否继续执行
      if (this.newTodo.trim() === "") {
        this.newTodo = "";
        return;
      }
      //向todos原始数据中添加数据
      this.todos.push({
        id: this.todos.length + 1,
        title: this.newTodo,
        completed: false,
      });
      //添加成功清空输入框的值newTodo
      this.newTodo = "";
    },

    //双击数据修改数据
    editTodo(todo) {
      this.focusTodo_id = todo.id;
      this.beforeTodo = todo.title;
    },

    //获取焦点的状态下按esc键退出还原数据，并清除还原后的
    escTodo(todo) {
      todo.title = this.beforeTodo;
      this.beforeTodo = "";
      this.blurTodo(todo);
    },

    //失去焦点，清除focusTodo_id，并判断新数据是否为空，为空则删除该数据
    blurTodo(todo) {
      this.focusTodo_id = null;
      if (todo.title.trim() === "") {
        this.removeTodo(todo.id);
      }
    },

    //删除一个数据
    removeTodo(id) {
      this.todos = this.todos.filter((item) => item.id !== id);
    },

    //清除多条数据
    clearTodos(){
      this.todos = this.todos.filter(item => !item.completed)
    }
  },

  watch: {
    //监听路有变化，当路有发生变化的时候，修改visibility为对应值
    "$route.name": {
      immediate: true,
      handler: function (newval) {
        this.visibility = newval;
      },
    },
  },

  //自定义指令
  directives: {
    focus(el, binding) {
      if (binding.value) {
        el.focus();
      }
    },
  },
};
</script>
<style lang="less" scoped>
.home {
  position: relative;
  overflow: hidden;
  height: 100%;
  .box {
    position: relative;
    width: 400px;
    border: 1px solid #ededed;
    .input {
      position: relative;
      height: 50px;
      background-color: blue;
      input[type="text"] {
        height: 100%;
        width: 100%;
        padding: 0 10px 0 60px;
        position: relative;
        border: none;
        border-bottom: 1px solid #ededed;
      }
      input[type="checkbox"] {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 10px;
      }
    }
    .list {
      position: relative;
      ul.todo-list {
        position: relative;
        li {
          position: relative;
          list-style: none;
          box-sizing: content-box;
          div.view {
            position: relative;
            border-bottom: 1px solid #ededed;
            input {
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              left: 15px;
            }
            label {
              padding: 15px 15px 15px 60px;
              display: block;
              line-height: 20px;
              transition: all 0.3s;
            }
            span.destroy {
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              right: 15px;
            }
          }
          input[type="text"] {
            display: none;
          }
        }
        li.focusTodo input[type="text"] {
          display: block;
          box-shadow: 0 0 3px inherit;
        }
        li.completed div.view label {
          text-decoration: line-through;
        }
      }
    }
    .footer {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 40px;
      background-color: #f7f7f7;
      padding: 0 10px;
      ul{
        display: flex;
        align-items: center;
        li{
          list-style: none;
          margin:0 6px;
        }
      }
    }
  }
}
</style>
