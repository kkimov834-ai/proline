import fs from 'node:fs';
const path = '/home/ubuntu/proline/client/src/pages/Home.tsx';
let text = fs.readFileSync(path, 'utf8');
text = text.replace('oscillator.connect(gain); gain.connect(audio.destination); oscillator.start();', 'oscillator.connect(gain); gain.connect(audio.destination); void audio.resume().then(() => oscillator.start());');
text = text.replace('<GripVertical size={14} className="text-[#4F626F] group-hover:text-[#D78A4A] shrink-0 transition" />', '{canDrag && <GripVertical size={14} className="text-[#4F626F] group-hover:text-[#D78A4A] shrink-0 transition" />}');
fs.writeFileSync(path, text);
