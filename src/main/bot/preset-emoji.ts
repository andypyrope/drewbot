export class PresetEmoji {
   static readonly SHIBA_OK: PresetEmoji = new PresetEmoji("shiba_ok", "497869225591963655");
   static readonly SHIBA_HEARTBROKEN: PresetEmoji = new PresetEmoji("shiba_heartbroken", "498190655843991554");

   constructor(private readonly name: string, private readonly id?: string) { }

   hasNameAndId(name: string, id: string): boolean {
      return this.name === name && (!this.id || this.id === id);
   }

   toString(): string {
      return this.id
         ? "<:" + this.name + ":" + this.id + ">"
         : ":" + this.name + ":";
   }
}
