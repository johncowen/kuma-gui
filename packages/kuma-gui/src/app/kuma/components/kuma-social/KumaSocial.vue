<template>
  <a
    class="btn"
    _target="_blank"
    href="https://github.com/kumahq/kuma"
    aria-label="Star kumahq/kuma on GitHub"
  >
    <svg
      viewBox="0 0 16 16"
      width="14"
      height="14"
      class="octicon octicon-mark-github"
      aria-hidden="true"
    >
      <path
        d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"
      />
    </svg>
    &nbsp;
    <span>Star</span>
  </a>
</template>
<style lang="scss" scoped>
.btn {
  text-decoration: none;
  outline: 0;
  position: relative;
  height: 20px;
  padding: 2px 5px;
  font-size: 11px;
  font-weight: 600;
  line-height: 14px;
  vertical-align: bottom;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background-repeat: repeat-x;
  background-position: -1px -1px;
  background-size: 110% 110%;
  border: 1px solid;
}
.btn {
  border-radius: 0.25em;
}
.octicon {
  display: inline-block;
  vertical-align: text-top;
  fill: currentColor;
  overflow: visible;
}
.btn:focus-visible {
  outline: 2px solid #0969da;
  outline-offset: -2px;
}
.btn {
  color: #25292e;
  background-color: #ebf0f4;
  border-color: #d1d9e0;
  background-image: linear-gradient(180deg, #f6f8fa, #ebf0f4 90%);
}
.btn:hover,
.btn:focus {
  background-color: #e5eaee;
  background-position: 0 -0.5em;
  border-color: #d1d9e0;
  background-image: linear-gradient(180deg, #eff2f5, #e5eaee 90%);
}
</style>
