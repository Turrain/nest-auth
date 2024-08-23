import argparse
import torch
from os import path
from openvoice import se_extractor
from openvoice.api import BaseSpeakerTTS, ToneColorConverter
from huggingface_hub import hf_hub_download


parser = argparse.ArgumentParser(description="tts")
parser.add_argument("text", type=str, help="text")
parser.add_argument("--lang", type=str, default="ZH", help="language")
parser.add_argument("--ref", type=str, help="reference")
parser.add_argument("--output", type=str, help="output")
args = parser.parse_args()

def hf_download(fullname, offline=False):
    ns, project, filename = fullname.split('/', 2)
    return hf_hub_download(repo_id=f"{ns}/{project}", filename=filename, local_files_only=offline, resume_download=not offline)

def main():
    lang = args.lang
    langs = dict(ZH='Chinese', EN='English')
    device='cpu'

    base_speaker_tts = BaseSpeakerTTS(hf_download(f'myshell-ai/OpenVoice/checkpoints/base_speakers/{lang}/config.json'), device=device)
    base_speaker_tts.load_ckpt(hf_download(f'myshell-ai/OpenVoice/checkpoints/base_speakers/{lang}/checkpoint.pth'))
    base_speaker_tts.tts(args.text, args.output, speaker='default', language=langs[lang], speed=1.0)
    if args.ref is None: return

    tone_color_converter = ToneColorConverter(hf_download('myshell-ai/OpenVoice/checkpoints/converter/config.json'), device=device)
    tone_color_converter.load_ckpt(hf_download('myshell-ai/OpenVoice/checkpoints/converter/checkpoint.pth'))
    source_se = torch.load(hf_download(f'myshell-ai/OpenVoice/checkpoints/base_speakers/{lang}/{lang.lower()}_default_se.pth')).to(device)
    target_se, audio_name = se_extractor.get_se(args.ref, tone_color_converter, target_dir='processed', vad=True)
    tone_color_converter.convert(
        audio_src_path=args.output,
        src_se=source_se,
        tgt_se=target_se,
        output_path=path.join(path.dirname(args.output), f"clone-{path.basename(args.output)}"),
        message="@message")

if __name__ == "__main__":
    main()