<template>
  <div class="locale-changer">
    <span>Language : </span>
    <select v-model="$i18n.locale">
      <option v-for="lang in langs" :key="`Lang${lang.key}`" :value="lang.key">{{ lang.text.toUpperCase() }}</option>
    </select>
  </div>
</template>

<script>
export default {
  name: "locale-changer",
  data() {
    return {
      langs : [
        {
          text : 'Thai',
          key : 'th',
        },
        {
          text : 'English',
          key : 'en',
        }
      ]
    };
  }
};
</script>