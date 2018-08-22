import { Component } from '@angular/core';

export const ITEMS = [
  { name: '亀仙人に弟子入り', explain: '亀仙人に弟子入り', show:35, cost:10 , cps:0.2, own:0 },
  { name: '超聖水', explain: 'カリン様に会って、超聖水を飲む', show:103, cost:30, cps:0.6, own:0 },
  { name: '超神水', explain: 'カリン様に会って、超神水を飲む', show:200, cost:100, cps:4, own:0 }
];

export const EVENTS = [
  { name: '悟空誕生', explain: '悟空誕生（戦闘力：約2）。地球にきて孫悟飯じいちゃんと人里離れた山で育つ。', show: 2 },  // DB超考察より
  { name: 'ブルマとの出会い', explain: '人里離れた山でＤＢを探していたブルマが悟空と出会い、一緒に旅立つ。', show: 10 },  // DB超考察より
  { name: '亀仙人との出会い', explain: '山で道に迷っていた海ガメを助けた。亀仙人から、悟空は筋斗雲、ブルマは三星球を貰った。', show: 15 },
  { name: 'ヤムチャとの出会い', explain: '砂漠で盗賊のヤムチャ（戦闘力：約8.6）とプーアルに出会った。', show: 20 },
  { name: 'かめはめ波習得', explain: 'フライパン山で牛魔王に依頼され、亀仙人に火を消してもらった。悟空はかめはめ波を覚えた！', show: 25 },
  { name: 'ギャルのパンティ', explain: 'ピラフにつかまり、シェンロンを呼び出された。ウーロン：「ギャルのパンティおくれーっ!!!」', show: 30 },
  { name: '亀仙人に弟子入り', explain: '悟空はブルマと別れ、亀仙人のもとで修行することに！', show: 35 },
  { name: '第21回天下一武道会出場', explain: '第21回天下一武道会に出場。決勝で待つのはジャッキー・チュン（戦闘力：約120）！', show: 80 },
  { name: '第21回天下一武道会 - 準優勝', explain: '決勝でジャッキー・チュン（戦闘力：約120）に負けた・・・。', show: 100 }, // DB超考察より
  { name: 'マッスルタワーの戦い', explain: 'マッスルタワーでレッドリボン軍と戦い、勝利した。', show: 101 }, 
  { name: 'アラレちゃんとの出会い', explain: 'ブルー将軍を追撃中、ペンギン村でアラレちゃんに会った。', show: 102 }, 
  { name: '桃白白登場', explain: '聖地カリンで、殺し屋桃白白（戦闘力：約130）と戦い敗北。', show: 103 },  // DB超考察より
  { name: '桃白白打倒', explain: 'カリン様の修行で強くなった悟空は、桃白白と再戦。勝利した！', show: 130 }, 
  { name: 'おじいさんとの再会', explain: '最後のドラゴンボールを求めて、占いババの館へ。おじいさんと再会する。', show: 135 }, 
  { name: '修行の旅へ', explain: 'ウパの父ボラを生き返らせ、新たなる修行の旅に出る。', show: 140 }, 
  { name: '第22回天下一武道会出場', explain: '天津飯（戦闘力：約180）との出会い、優勝を目指して戦う。', show: 150 },   // DB超考察より
  { name: '第22回天下一武道会 - 準優勝', explain: '決勝戦、おしくも敗北。試合終了後、クリリンが何者かに殺される。', show: 175 }, 
  { name: 'タンバリン戦', explain: 'タンバリンと戦うが敗北。ヤジロベーに出会い体力回復し、タンバリンを倒す', show: 190 }, 
  { name: 'ピッコロ戦1', explain: 'ピッコロ大魔王に敗北。亀仙人も殺され、ピッコロは若返る（戦闘力：約220 → 520）', show: 200 }, 
  { name: 'ピッコロ戦2', explain: 'カリン塔で超神水を飲んでパワーアップ。ピッコロ大魔王に勝利する。（とりあえずここまで。）', show: 520 }, 
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'dbck';

  private scouter:number;
  private max_scouter:number;
  private cps:number;
  private items = ITEMS;
  private events = EVENTS;
  private interval_id;
  private item_cost_ratio = 1.15; // アイテム購入時のアイテム金額インフレーション倍率

  ngOnInit(){

    // 初期値設定
    this.scouter = 8;
    this.max_scouter = this.scouter;
    this.cps = 0;

    // 毎秒処理
    this.interval_id = setInterval(()=>{
      this.scouter = this.getRound( this.scouter + this.cps );
      this.updateMaxScouter();
    },1000);
  }

  // クリック時の処理
  private click():void{
    this.scouter = this.getRound( this.scouter + 1 ); // クリックで戦闘力が増える
    this.updateMaxScouter();
  }

  // アイテム購入
  private clickItem(item):any{

    // ポイントがたまってなければ無視
    if( this.scouter < item.cost){
      return false;
    }

    // コストを支払って、cpsを上げる。
    this.scouter = this.getRound( this.scouter - item.cost );
    this.cps = this.getRound( this.cps + item.cps );
    item.own += 1;

    // アイテムの価格をインフレさせる
    item.cost = this.getRound( item.cost * this.item_cost_ratio );

    // 初めて買ったときは、イベント発生
    if(item.own == 1){
      console.log(`[アイテムイベント発生]: ${item.name}`);
    }
  }

  // max_scouterの更新
  private updateMaxScouter():void{
    
    if(this.max_scouter < this.scouter){
      this.max_scouter = this.scouter;
    }
  }

  // 小数点1ケタで四捨五入
  private getRound(num):number{
    return Math.round(num * 10) / 10;
  }
}
