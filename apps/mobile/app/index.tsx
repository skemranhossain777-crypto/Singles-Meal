
import { ScrollView, View, Text, Image, Pressable, StyleSheet } from "react-native";
import { Link } from "expo-router";
const green="#246B45";
const meals=[
 {name:"Grilled Chicken Power Bowl",price:"৳390",kcal:"480 kcal",protein:"38g protein",img:"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=900"},
 {name:"Garden Egg & Avocado Toast",price:"৳260",kcal:"350 kcal",protein:"19g protein",img:"https://images.unsplash.com/photo-1525351484163-7529414344d8?w=900"}
];
export default function Home(){
 return <ScrollView contentContainerStyle={s.page}>
  <View style={s.top}><View><Text style={s.brand}>Singles Meal</Text><Text style={s.muted}>Eat Better. Track Smarter.</Text></View><Text style={s.avatar}>SM</Text></View>
  <View style={s.hero}><Text style={s.kicker}>YOUR DAILY WELLNESS, DELIVERED</Text><Text style={s.title}>Feel good about{"\n"}every meal.</Text><Text style={s.body}>Fresh, balanced meals built around your preferences and goals.</Text><Link href="/health" asChild><Pressable style={s.primary}><Text style={s.primaryText}>Set my food preferences →</Text></Pressable></Link></View>
  <View style={s.row}><Text style={s.heading}>Today's nutrition</Text><Text style={s.link}>View details</Text></View>
  <View style={s.nutrition}><Text style={s.muted}>Daily calorie goal · demo</Text><Text style={s.calories}>1,240 <Text style={s.small}>/ 2,000 kcal</Text></Text><View style={s.bar}><View style={s.fill}/></View><View style={s.row}><Text>Protein 72g</Text><Text>Carbs 140g</Text><Text>Fat 38g</Text></View></View>
  <View style={s.row}><Text style={s.heading}>Popular meals</Text><Link href="/meals" style={s.link}>See all</Link></View>
  {meals.map(m=><View style={s.meal} key={m.name}><Image source={{uri:m.img}} style={s.image}/><View style={{flex:1}}><Text style={s.mealName}>{m.name}</Text><Text style={s.muted}>{m.kcal} · {m.protein}</Text><Text style={s.price}>{m.price}</Text></View></View>)}
  <View style={s.nav}><Link href="/" style={s.navItem}>⌂ Home</Link><Link href="/meals" style={s.navItem}>▤ Meals</Link><Link href="/health" style={s.navItem}>♡ Health</Link></View>
 </ScrollView>
}
const s=StyleSheet.create({page:{padding:20,paddingTop:56,paddingBottom:40},top:{flexDirection:"row",justifyContent:"space-between",alignItems:"center"},brand:{fontSize:22,fontWeight:"900",color:"#17231C"},muted:{color:"#718078",fontSize:12,marginTop:4},avatar:{backgroundColor:"#DCEBE0",padding:13,borderRadius:30,color:green,fontWeight:"800"},hero:{backgroundColor:"#E7F1E9",padding:24,borderRadius:28,marginTop:26},kicker:{fontSize:10,fontWeight:"800",letterSpacing:1.5,color:green},title:{fontSize:34,fontWeight:"900",lineHeight:39,marginTop:14,color:"#17231C"},body:{fontSize:14,lineHeight:21,color:"#637168",marginTop:12},primary:{backgroundColor:green,padding:14,borderRadius:30,alignSelf:"flex-start",marginTop:18},primaryText:{color:"white",fontWeight:"800"},row:{flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginTop:28,marginBottom:12},heading:{fontSize:20,fontWeight:"900",color:"#17231C"},link:{color:green,fontWeight:"800",fontSize:12},nutrition:{backgroundColor:"white",borderRadius:22,padding:18},calories:{fontSize:34,fontWeight:"900",marginTop:8},small:{fontSize:13,color:"#718078",fontWeight:"500"},bar:{height:9,backgroundColor:"#E9EFEA",borderRadius:10,marginVertical:14,overflow:"hidden"},fill:{width:"62%",height:9,backgroundColor:"#54A56B",borderRadius:10},meal:{flexDirection:"row",backgroundColor:"white",padding:12,borderRadius:20,marginBottom:12,gap:14,alignItems:"center"},image:{width:104,height:104,borderRadius:16},mealName:{fontSize:15,fontWeight:"800",color:"#17231C"},price:{fontWeight:"900",color:green,marginTop:8},nav:{flexDirection:"row",justifyContent:"space-around",backgroundColor:"#17231C",padding:15,borderRadius:30,marginTop:24},navItem:{color:"white",fontWeight:"700",fontSize:12}});
