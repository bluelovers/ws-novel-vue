<template>
  <div class="about">
    <h1>This is an about page</h1>

    <vs-button color="primary" type="filled">Primary</vs-button>
    <vs-button color="success" type="filled">Success</vs-button>
    <vs-button color="danger" type="filled">Danger</vs-button>
    <vs-button color="warning" type="filled">Warning</vs-button>
    <vs-button color="dark" type="filled">Dark</vs-button>
    <vs-button color="rgb(134, 4, 98)" type="filled">RGB</vs-button>
    <vs-button disabled type="filled">Disabled</vs-button>
    <vs-button color="primary" type="filled" to="/components/list.html">Router</vs-button>
    <div class="centerx">
      <vs-chip>
        <vs-avatar />
        Icon Default
      </vs-chip>
      <vs-chip color="primary">
        <vs-avatar icon="send" />
        Icon send
      </vs-chip>
      <vs-chip color="success">
        <vs-avatar icon="markunread" />
        Icon markunread
      </vs-chip>
      <vs-chip color="danger">
        <vs-avatar icon="link_off" />
        Icon link_off
      </vs-chip>
      <vs-chip color="warning">
        <vs-avatar icon="battery_alert" />
        Icon battery_alert
      </vs-chip>
      <vs-chip color="dark">
        <vs-avatar icon="edit" />
        Icon edit
      </vs-chip>
    </div>

    <div class="centerx">
      <vs-button @click="openAlert('primary')" color="primary" type="flat">Alert Primary</vs-button>
      <vs-button @click="openAlert('success')" color="success" type="flat">Alert Success</vs-button>
      <vs-button @click="openAlert('danger')" color="danger" type="flat">Alert Danger</vs-button>
      <vs-button @click="openAlert('warning')" color="warning" type="flat">Alert Warning</vs-button>
      <vs-button @click="openAlert('dark')" color="dark" type="flat">Alert Dark</vs-button>
      <vs-button @click="openAlert(null)" color="primary" type="gradient">Alert Color RGB | HEX</vs-button>
    </div>


    <div class="text-xs-center">
      <v-dialog
          v-model="dialog"
          width="500"
      >
        <v-btn
            slot="activator"
            color="red lighten-2"
            dark
        >
          Click Me
        </v-btn>

        <v-card>
          <v-card-title
              class="headline grey lighten-2"
              primary-title
          >
            Privacy Policy
          </v-card-title>

          <v-card-text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="primary"
                flat
                @click="dialog = false"
            >
              I accept
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>


      <Tag color="default">default</Tag>
      <Tag color="primary">primary</Tag>
      <Tag color="success">success</Tag>
      <Tag color="error">error</Tag>
      <Tag color="warning">warning</Tag>
      <Tag color="magenta">magenta</Tag>
      <Tag color="red">red</Tag>
      <Tag color="volcano">volcano</Tag>
      <Tag color="orange">orange</Tag>
      <Tag color="gold">gold</Tag>
      <Tag color="yellow">yellow</Tag>
      <Tag color="lime">lime</Tag>
      <Tag color="green">green</Tag>
      <Tag color="cyan">cyan</Tag>
      <Tag color="blue">blue</Tag>
      <Tag color="geekblue">geekblue</Tag>
      <Tag color="purple">purple</Tag>
      <Tag color="#FFA2D3">Custom Color</Tag>
      <br><br>
      <Tag type="border" closable color="primary">标签一</Tag>
      <Tag type="border" closable color="success">标签二</Tag>
      <Tag type="border" closable color="error">标签三</Tag>
      <Tag type="border" closable color="warning">标签四</Tag>
      <br><br>
      <Tag type="dot" closable color="primary">标签一</Tag>
      <Tag type="dot" closable color="success">标签二</Tag>
      <Tag type="dot" closable color="error">标签三</Tag>
      <Tag type="dot" closable color="warning">标签四</Tag>

  </div>



</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src

import testjson from '../../public/static/novel-stat.json';

console.log(testjson.meta);

@Component({
  components: {
    HelloWorld,
  },
  data () {
    return {
      dialog: false
    }
  }
})
export default class About extends Vue {}
</script>
