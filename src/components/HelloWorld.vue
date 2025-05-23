<script setup lang="ts">
import { ref, watchEffect, onMounted, onUnmounted, nextTick } from "vue";
import Mock from "mockjs";
import { throttle } from "lodash-es";
import { showToast } from "vant";

const loading = ref(false);
const list = ref([]);
const page = ref(1);
const noMore = ref(false);
const scrollContainer = ref(null);

watchEffect(() => {});

onMounted(() => {
  setTimeout(() => {
    getList();
  }, 300);
  scrollContainer.value.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  // scrollContainer.value.removeEventListener("scroll", handleScroll);
});

const getList = () => {
  const params = getUrlParams();
  const data = Mock.mock({
    "list|10": [
      {
        id: "@id",
        title: "@title(2, 5)",
        content:
          params.type !== "video"
            ? () => ({
                img: Mock.Random.image(),
              })
            : () => ({
                video: Mock.Random.image(),
              }),
        "label|2": ["@word(1, 3)", "@word(2, 4)"],
        user: {
          name: "@cname",
          avatar: "@image(18x18, #ffcc33)",
        },
        like: "@integer(0, 100)",
      },
    ],
  }).list;
  list.value.push(...data);
};

const onRefresh = () => {
  setTimeout(() => {
    showToast("刷新成功");
    loading.value = false;
    list.value = [];
    getList();
  }, 1000);
};

const getUrlParams = () => {
  const search = window.location.search.substring(1);
  const params = {};
  search.split("&").forEach((pair) => {
    const [key, value] = pair.split("=");
    params[key] = decodeURIComponent(value || "");
  });
  return params;
};

// 滚动事件节流（传统scroll事件方案）
const handleScroll = throttle((e) => {
  const { scrollTop, scrollHeight, clientHeight } = e.srcElement;
  if (scrollTop + clientHeight >= scrollHeight - 100) {
    getList();
  }
}, 300);
</script>

<template>
  <div class="demo">
    <van-pull-refresh v-model="loading" @refresh="onRefresh">
      <div ref="scrollContainer" class="list-container">
        <div
          v-for="(item, index) in list"
          :key="item.id"
          class="list-item"
          :style="{
            padding: index % 2 === 0 ? '0 0 20px 10px' : '20px 10px 0 0',
            height: index % 2 === 0 ? 'calc(30vh - 20px)' : 'calc(30vh - 20px)',
          }"
        >
          <div class="content">
            <img v-if="item?.content?.img" :src="item.content.img" />
            <div v-if="item?.content?.video">
              <video
                :id="`my-player-${item.id}`"
                class="video-js"
                controls
                preload="auto"
                :poster="item?.content?.video"
                data-setup="{}"
              >
                <source src="//vjs.zencdn.net/v/oceans.mp4" type="video/mp4" />
                <source
                  src="//vjs.zencdn.net/v/oceans.webm"
                  type="video/webm"
                />
                <source src="//vjs.zencdn.net/v/oceans.ogv" type="video/ogg" />
              </video>
            </div>
          </div>
          <div class="title">{{ item.title }}</div>
          <div class="label">
            <div v-for="tag in item.label" :key="tag" class="tag">
              {{ tag }}
            </div>
          </div>
          <div class="bottom">
            <div class="user">
              <img class="avatar" :src="item.user.avatar" />
              <div class="name">{{ item.user.name }}</div>
            </div>
            <div class="like">
              <van-icon name="like-o" />
              <span class="count">{{ item.like }}</span>
            </div>
          </div>
        </div>
      </div>
    </van-pull-refresh>
  </div>
</template>

<style scoped>
.demo {
  width: 100vw;
  height: 100vh;
}

.van-pull-refresh {
  width: 100%;
  height: 100%;
}

.list-container {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  -webkit-overflow-scrolling: touch; /* 启用弹性滚动 */
  scrollbar-width: none; /* Firefox 兼容 */
  /* iOS 弹性滚动 */
  -webkit-overflow-scrolling: touch;
  /* 隐藏安卓默认滚动条 */
  scrollbar-color: transparent transparent;
  scrollbar-width: none;
}

.list-container::-webkit-scrollbar {
  display: none;
  width: 0;
}

.list-item {
  width: calc(49% - 10px);
  height: 30vh;
  font-size: 0.8rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 8px;
}

.content {
  width: 100%;
  height: 50%;
}

.content > *,
.content > div > *,
.content > div > div > * {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.title {
  width: 100%;
}

.label {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}

.label .tag {
  color: #999;
  background-color: #eee;
  border-radius: 4px;
  margin-right: 4px;
  padding: 0px 4px;
}

.bottom {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user {
  display: flex;
}

.user .avatar {
  border: 2px solid #ccc;
  border-radius: 50%;
}

.user .name {
  margin-left: 6px;
}

.like .count {
  margin-left: 6px;
}
</style>
